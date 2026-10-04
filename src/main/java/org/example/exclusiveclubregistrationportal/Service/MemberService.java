package org.example.exclusiveclubregistrationportal.Service;


import org.example.exclusiveclubregistrationportal.DTO.MemberDTO;
import org.example.exclusiveclubregistrationportal.Model.Member;
import org.example.exclusiveclubregistrationportal.Repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
//adding caching in service
@Service
public class MemberService {
    @Autowired
    private  MemberRepository memberRepository;

    @Transactional
    @CacheEvict(value="users",allEntries=true)
   public Member registerMember(MemberDTO dto){
       if(memberRepository.findByEmail(dto.getEmail()).isPresent()){
           throw new RuntimeException("Email already registered!");
       }
       Member m=new Member(dto.getName(),dto.getEmail());
       return memberRepository.save(m);
   }

   @Transactional
   @CacheEvict(value="users",allEntries=true)
   public void deleteMember(long id){
       Optional<Member> m=memberRepository.findById(id);
       if(m.isEmpty()){
           throw new RuntimeException("Member not found!");
       }
       Member m1=m.get();
       m1.setDeleted(true);
       memberRepository.save(m1);
   }

   @Cacheable(value="users",key=" 'all-active' ")
   public List<Member> findAllActiveMembers(){
       return memberRepository.findAllActiveMembers();

   }
    // 1. Get Single Member
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));
    }

    // 2. Update Member
    public Member updateMember(Long id, MemberDTO memberDTO) {
        // Find the existing record first
        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));

        // Update the fields (Modify based on your actual entity fields)
        existingMember.setName(memberDTO.getName());
        existingMember.setEmail(memberDTO.getEmail());

        // Save and return the updated record
        return memberRepository.save(existingMember);
    }






}
