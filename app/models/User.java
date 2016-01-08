package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.avaje.ebean.Model;

@Entity
public class User extends Model {

	@Id
	public String email;
	public String password;
	public String firstName;
	public String lastName;
	
}
