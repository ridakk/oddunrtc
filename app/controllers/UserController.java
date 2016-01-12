package controllers;


import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

import play.mvc.*;
import play.db.jpa.*;
import models.User;

import static play.libs.Json.*;

public class UserController extends Controller {

	@Transactional
	@BodyParser.Of(BodyParser.Json.class)
    public Result add() {
		JsonNode json = request().body().asJson();
	    
	    User user = new User();
	    user.email = json.findPath("email").textValue();
	    user.password = json.findPath("password").textValue();
	    user.firstName = json.findPath("firstName").textValue();
	    user.lastName = json.findPath("lastName").textValue();
        JPA.em().persist(user);
	    
	    return ok("/users/" + user.email);
    }
    
    public Result update(String email) {
        return ok();
    }
    
    @Transactional(readOnly = true)
    public Result get(String email) {
    	User user = JPA.em().find(User.class, email);
    	return ok(toJson(user));
    }
    
    public Result remove(String email) {
        return ok();
    }
    
    @Transactional(readOnly = true)
    public Result getAll() {
        List<User> users = (List<User>) JPA.em().createQuery("select p from User p").getResultList();
        return ok(toJson(users));
    }
}
