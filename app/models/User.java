package models;

import javax.persistence.*;

@Entity
public class User {

	@Id
	public String email;
	public String password;
	public String firstName;
	public String lastName;
}
