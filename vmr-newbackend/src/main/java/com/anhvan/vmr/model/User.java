package com.anhvan.vmr.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class User {
  private String username;
  private String name;
  private int id;
  private boolean online;

  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @JsonIgnore private boolean active;
}
