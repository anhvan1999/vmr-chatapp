package com.anhvan.vmr.controller;

import com.anhvan.vmr.cache.TokenCacheService;
import com.anhvan.vmr.cache.UserCacheService;
import com.anhvan.vmr.database.UserDBService;
import com.anhvan.vmr.util.JwtUtil;
import dagger.Module;
import dagger.Provides;
import dagger.multibindings.IntoMap;
import dagger.multibindings.StringKey;
import io.vertx.core.Vertx;

@Module
public class ControllerModule {
  @Provides
  @IntoMap
  @StringKey("/")
  public Controller provideIndexController(Vertx vertx) {
    return IndexController.builder().vertx(vertx).build();
  }

  @Provides
  @IntoMap
  @StringKey("/api/public/login")
  public Controller provideLoginController(
      Vertx vertx,
      UserDBService userDBService,
      UserCacheService userCacheService,
      JwtUtil jwtUtil) {
    return LoginController.builder()
        .vertx(vertx)
        .userDBService(userDBService)
        .userCacheService(userCacheService)
        .jwtUtil(jwtUtil)
        .build();
  }

  @Provides
  @IntoMap
  @StringKey("/api/public/register")
  public Controller provideRegisterController(
      Vertx vertx,
      UserDBService userDBService,
      JwtUtil jwtUtil,
      UserCacheService userCacheService) {
    return RegisterController.builder()
        .vertx(vertx)
        .userCacheService(userCacheService)
        .jwtUtil(jwtUtil)
        .userDBService(userDBService)
        .build();
  }

  @Provides
  @IntoMap
  @StringKey("/api/protected/users")
  public Controller provideUserController(
      Vertx vertx, UserDBService userDBService, UserCacheService userCacheService) {
    return UserController.builder()
        .vertx(vertx)
        .userDBService(userDBService)
        .userCacheService(userCacheService)
        .build();
  }

  @Provides
  @IntoMap
  @StringKey("/api/protected/info")
  public Controller provideUserInfoController(
      Vertx vertx, UserDBService userDBService, UserCacheService userCacheService) {
    return UserInfoController.builder()
        .vertx(vertx)
        .userDBService(userDBService)
        .userCacheService(userCacheService)
        .build();
  }

  @Provides
  @IntoMap
  @StringKey("/api/protected/logout")
  public Controller provideLogoutController(Vertx vertx, TokenCacheService tokenCacheService) {
    return LogoutController.builder().vertx(vertx).tokenCacheService(tokenCacheService).build();
  }
}
