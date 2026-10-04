package org.example.exclusiveclubregistrationportal.Controller;

import jakarta.validation.Valid;
import org.example.exclusiveclubregistrationportal.DTO.MemberDTO;
import org.example.exclusiveclubregistrationportal.Model.Member;
import org.example.exclusiveclubregistrationportal.Service.EmailService;
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

    // 1. Inject the EmailService
    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@Valid @RequestBody MemberDTO memberDTO, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return new ResponseEntity<>(bindingResult.getFieldError().getDefaultMessage(),HttpStatus.BAD_REQUEST);
        }
        try {
            // 2. Capture the saved member instead of returning it immediately
            Member savedMember = memberService.registerMember(memberDTO);

            // 3. Trigger the async email in the background
            emailService.sendWelcomeEmail(savedMember.getEmail(), savedMember.getName());

            // 4. Return the HTTP response immediately without waiting for SMTP
            return ResponseEntity.ok().body(savedMember);
        }
        catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id){
        try{
            memberService.deleteMember(id);
            return ResponseEntity.ok("Member deleted successfully.");
        }
        catch(RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<Member>> getActiveMembers(){
        return ResponseEntity.ok(memberService.findAllActiveMembers());
    }

    // Fetch a single member by their ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMemberById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(memberService.getMemberById(id));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // Update an existing member's details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(
            @PathVariable Long id,
            @Valid @RequestBody MemberDTO memberDTO,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(bindingResult.getFieldError().getDefaultMessage(), HttpStatus.BAD_REQUEST);
        }

        try {
            // Returns the updated member
            Member updatedMember = memberService.updateMember(id, memberDTO);
            return ResponseEntity.ok().body(updatedMember);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }




}