package com.anhvan.vmr.controller;

import com.anhvan.vmr.cache.TokenCacheService;
import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Builder
@AllArgsConstructor
public class LogoutController implements Controller {
  private Vertx vertx;
  private TokenCacheService tokenCacheService;

  @Override
  public Router getRouter() {
    Router router = Router.router(vertx);

    router
        .post("/")
        .handler(
            routingContext -> {
              String token = routingContext.request().getHeader("Authorization").substring(7);
              tokenCacheService.addToBlackList(token);
              routingContext.response().end();
            });

    return router;
  }
}
