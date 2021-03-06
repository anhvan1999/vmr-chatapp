package com.anhvan.vmr.dagger;

import com.anhvan.vmr.configs.AuthConfig;
import com.anhvan.vmr.configs.ServerConfig;
import com.anhvan.vmr.configs.VertxConfig;
import dagger.Module;
import dagger.Provides;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.prometheus.PrometheusMeterRegistry;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.http.HttpServerOptions;
import io.vertx.ext.auth.JWTOptions;
import io.vertx.ext.auth.PubSecKeyOptions;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.micrometer.MicrometerMetricsOptions;
import io.vertx.micrometer.VertxPrometheusOptions;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;

import javax.inject.Singleton;

@Module
@AllArgsConstructor
@Log4j2
public class VmrModule {
  @Provides
  @Singleton
  @SuppressWarnings("deprecation")
  JWTAuthOptions provideJWTAuthOptions(AuthConfig config) {
    return new JWTAuthOptions()
        .addPubSecKey(
            new PubSecKeyOptions()
                .setAlgorithm("HS256")
                .setPublicKey(config.getToken())
                .setSymmetric(true))
        .setJWTOptions(new JWTOptions().setExpiresInSeconds(config.getExpire()));
  }

  @Provides
  @Singleton
  public JWTAuth provideJwtAuth(Vertx vertx, JWTAuthOptions options) {
    return JWTAuth.create(vertx, options);
  }

  @Provides
  @Singleton
  public Vertx provideVertx(VertxOptions vertxOptions) {
    return Vertx.vertx(vertxOptions);
  }

  @Provides
  @Singleton
  public VertxOptions provideVertxOptions(
      VertxConfig vertxConfig, MicrometerMetricsOptions metricsOptions) {
    return new VertxOptions()
        .setPreferNativeTransport(true)
        .setWorkerPoolSize(vertxConfig.getNumOfWorkerThread())
        .setMetricsOptions(metricsOptions);
  }

  @Provides
  @Singleton
  public MicrometerMetricsOptions provideMicrometerMetricsOptions(
      ServerConfig serverConfig, MeterRegistry meterRegistry) {
    VertxPrometheusOptions prometheusOptions =
        new VertxPrometheusOptions()
            .setEnabled(true)
            .setStartEmbeddedServer(true)
            .setPublishQuantiles(true)
            .setEmbeddedServerOptions(
                new HttpServerOptions().setPort(serverConfig.getPrometheusPort()))
            .setEmbeddedServerEndpoint("/metrics");

    return new MicrometerMetricsOptions()
        .setMicrometerRegistry(meterRegistry)
        .setJvmMetricsEnabled(true)
        .setPrometheusOptions(prometheusOptions)
        .setEnabled(true);
  }

  @Provides
  @Singleton
  public MeterRegistry provideMeterRegistry() {
    return new PrometheusMeterRegistry(PrometheusConfig.DEFAULT);
  }
}
