package org.example.exclusiveclubregistrationportal.Repository;

import org.example.exclusiveclubregistrationportal.Model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {

    Optional<Member> findByEmail(String email);

@Query("Select m from Member m where m.isDeleted=false")
List<Member> findAllActiveMembers();
}
