package com.anhvan.vmr.config;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class VertxConfig {
  private int numOfWorkerThread;
}
