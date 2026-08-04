package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.Address;
import com.gemstoneseekers.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {
}
