package org.example.exclusiveclubregistrationportal.Controller;

import jakarta.validation.Valid;
import org.example.exclusiveclubregistrationportal.DTO.MemberDTO;
import org.example.exclusiveclubregistrationportal.Model.Member;
import org.example.exclusiveclubregistrationportal.Repository.MemberRepository;
import org.example.exclusiveclubregistrationportal.Service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MemberController {
    @Autowired
    private MemberService memberService;
    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@Valid @RequestBody MemberDTO memberDTO, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return new ResponseEntity<>(bindingResult.getFieldError().getDefaultMessage(),HttpStatus.BAD_REQUEST);
        }
        try {
            return ResponseEntity.ok().body(memberService.registerMember(memberDTO));
        }
        catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);

        }

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id){
        try{
          memberService.deleteMember(id);
          return ResponseEntity.ok("Member  deleted successfully.");
        }
        catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping
    public ResponseEntity<List<Member>> getActiveMembers(){
        return ResponseEntity.ok(memberService.findAllActiveMembers());

    }



}
