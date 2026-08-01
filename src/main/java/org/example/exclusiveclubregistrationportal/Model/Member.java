package org.example.exclusiveclubregistrationportal.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name="member")
@Getter
@Setter
public class Member implements Serializable {

   private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long id;
    String name;
    String email;
    boolean isDeleted=false;
    public Member() {
    }
    public Member(String name, String email ){
        this.name = name;
        this.email = email;

    }


}
