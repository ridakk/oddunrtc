package models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


@Entity
public class Connection {

	@Id
	@GeneratedValue
	public Long id;
	
	public String email;
}
