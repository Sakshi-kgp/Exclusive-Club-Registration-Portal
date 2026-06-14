package org.example.exclusiveclubregistrationportal.Service;

import org.example.exclusiveclubregistrationportal.DTO.MemberDTO;
import org.example.exclusiveclubregistrationportal.Model.Member;
import org.example.exclusiveclubregistrationportal.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {
    @Autowired
    private  MemberRepository memberRepository;

   public Member registerMember(MemberDTO dto){
       if(memberRepository.findByEmail(dto.getEmail()).isPresent()){
           throw new RuntimeException("Email already registered!");
       }
       Member m=new Member(dto.getName(),dto.getEmail());
       return memberRepository.save(m);
   }
   public void deleteMember(long id){
       Optional<Member> m=memberRepository.findById(id);
       if(m.isEmpty()){
           throw new RuntimeException("Member not found!");
       }
       Member m1=m.get();
       m1.setDeleted(true);
       memberRepository.save(m1);
   }

   public List<Member> findAllActiveMembers(){
       return memberRepository.findAllActiveMembers();

   }
}
