package com.anhvan.vmr;

import com.anhvan.vmr.util.ConfigLoaderUtil;
import com.anhvan.vmr.verticle.DatabaseVerticle;
import com.anhvan.vmr.verticle.CacheVerticle;
import com.anhvan.vmr.verticle.ServerVerticle;
import com.anhvan.vmr.verticle.ServiceVerticle;
import io.vertx.core.AsyncResult;
import io.vertx.core.json.JsonObject;
import io.vertx.reactivex.config.ConfigRetriever;
import io.vertx.reactivex.core.Vertx;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class VmrProgram {
  private static final Logger LOGGER = LogManager.getLogger(VmrProgram.class);

  public static void main(String[] args) {
    LOGGER.info("Start application");

    // Create vertx instance
    Vertx vertx = Vertx.vertx();

    // Load config
    ConfigRetriever configRetriever = ConfigLoaderUtil.load(vertx);

    // Pass config to verticles
    configRetriever.getConfig(jsonAsyncResult -> handleConfig(vertx, jsonAsyncResult));
  }

  public static void handleConfig(Vertx vertx, AsyncResult<JsonObject> jsonResult) {
    if (jsonResult.succeeded()) {
      // Create verticles
      LOGGER.info("Load configuration successfully");
      registerVerticle(vertx, jsonResult.result());
    } else {
      // Close application
      LOGGER.error("Error when load configuration", jsonResult.cause());
      vertx.close();
    }
  }

  public static void registerVerticle(Vertx vertx, JsonObject configuration) {
    vertx.deployVerticle(new ServerVerticle(configuration.getJsonObject("webserver")));
    vertx.deployVerticle(new CacheVerticle(configuration.getJsonObject("redis")));
    vertx.deployVerticle(new DatabaseVerticle(configuration.getJsonObject("mysql")));
    vertx.deployVerticle(new ServiceVerticle(configuration.getJsonObject("service")));
  }
}
