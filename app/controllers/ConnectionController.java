package controllers;

import static java.util.concurrent.TimeUnit.SECONDS;
import static play.libs.Json.toJson;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

import akka.actor.*;
import play.libs.F.*;
import play.mvc.WebSocket;
import models.Connection;
import models.Pinger;
import models.User;
import play.db.jpa.JPA;
import play.db.jpa.Transactional;
import play.libs.Akka;
import play.libs.F.Callback0;
import play.mvc.Controller;
import play.mvc.Result;
import scala.concurrent.duration.Duration;
import akka.actor.Props;

//TODO: method validation
//TODO: how to store websocket objects
//TODO: validate email and id before creating new websocket
//TODO: add method get all websockets

public class ConnectionController extends Controller {
    public WebSocket<String> ws(String email, Long id) {
    	return new WebSocket<String>() {
            public void onReady(WebSocket.In<String> in, WebSocket.Out<String> out) {
                final ActorRef pingActor = Akka.system().actorOf(Props.create(Pinger.class, in, out));
                final Cancellable cancellable = Akka.system().scheduler().schedule(Duration.create(1, SECONDS),
                                                   Duration.create(1, SECONDS),
                                                   pingActor,
                                                   "Tick",
                                                   Akka.system().dispatcher(),
                                                   null
                                                   );
                
                in.onClose(new Callback0() {
                	@Override
                	public void invoke() throws Throwable {
                		cancellable.cancel();
                	}
                });
                
                out.write("Hello!");
            }

        };
    }
    
    @Transactional
    public Result add(String email) {
	    
	    Connection conn = new Connection();
	    conn.email = email;
	    JPA.em().persist(conn);
	    return ok("/user/" + email +"/connection/ws/" + conn.id);
    }
    
    @Transactional(readOnly = true)
    public Result getAll(String email) {
        List<Connection> connIds = (List<Connection>) JPA.em().createQuery("select id from Connection where email = '" + email + "'").getResultList();
        return ok(toJson(connIds));
    }
}