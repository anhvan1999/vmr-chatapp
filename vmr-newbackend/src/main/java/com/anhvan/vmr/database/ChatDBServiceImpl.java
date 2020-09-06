package com.anhvan.vmr.database;

import com.anhvan.vmr.model.WsMessage;
import com.anhvan.vmr.util.AsyncWorkerUtil;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.mysqlclient.MySQLPool;
import io.vertx.sqlclient.Row;
import io.vertx.sqlclient.RowSet;
import io.vertx.sqlclient.Tuple;
import lombok.extern.log4j.Log4j2;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Log4j2
public class ChatDBServiceImpl implements ChatDBService {
  public static final String GET_MESSAGES_QUERY =
      "select * from messages "
          + "where (sender=? and receiver=?) or (sender=? and receiver=?) "
          + "order by id desc "
          + "limit ?, 20";

  public static final String INSERT_MESSAGE =
      "insert into messages (sender, receiver, message, send_time) values (?, ?, ?, ?)";

  private MySQLPool pool;
  private AsyncWorkerUtil workerUtil;

  @Inject
  public ChatDBServiceImpl(DatabaseService databaseService, AsyncWorkerUtil workerUtil) {
    pool = databaseService.getPool();
    this.workerUtil = workerUtil;
  }

  public void addChat(WsMessage msg) {
    log.debug("Add chat message {} to database", msg);

    pool.preparedQuery(INSERT_MESSAGE)
        .execute(
            Tuple.of(msg.getSenderId(), msg.getReceiverId(), msg.getMessage(), msg.getTimestamp()),
            rowSetAsyncResult -> {
              if (!rowSetAsyncResult.succeeded()) {
                log.error("Error when add chat {}", msg.toString(), rowSetAsyncResult.cause());
              }
            });
  }

  public Future<List<WsMessage>> getChatMessages(int user1, int user2, int offset) {
    log.debug(
        "Get chat message between user {} and {} from database with offset {}",
        user1,
        user2,
        offset);

    Promise<List<WsMessage>> listMsgPromise = Promise.promise();

    List<WsMessage> messages = new ArrayList<>();
    workerUtil.execute(
        () ->
            pool.preparedQuery(GET_MESSAGES_QUERY)
                .execute(
                    Tuple.of(user1, user2, user2, user1, offset),
                    rowSet -> {
                      if (rowSet.succeeded()) {
                        RowSet<Row> result = rowSet.result();
                        result.forEach(row -> messages.add(rowToWsMessage(row)));
                      } else {
                        log.error(
                            "Get chat message between user {} and {} from database with offset {}",
                            user1,
                            user2,
                            offset,
                            rowSet.cause());
                      }
                      Collections.reverse(messages);
                      listMsgPromise.complete(messages);
                    }));

    return listMsgPromise.future();
  }

  public WsMessage rowToWsMessage(Row row) {
    return WsMessage.builder()
        .id(row.getLong("id"))
        .senderId(row.getInteger("sender"))
        .receiverId(row.getInteger("receiver"))
        .timestamp(row.getLong("send_time"))
        .message(row.getString("message"))
        .build();
  }
}
