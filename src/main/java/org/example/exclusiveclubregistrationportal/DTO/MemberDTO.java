package org.example.exclusiveclubregistrationportal.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDTO {
    @NotNull(message="Name cannot be empty")
      @Size(min=3, message="name must be at least 3 character")
    String name;
    @NotNull(message="Email is required")
    @Email(message="Invalid email format")
    String email;

}
