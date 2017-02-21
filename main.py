#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#Person(key_name='bettyd', name='Betty', age=42).put()
import os,webapp2,jinja2,random
import hashlib, json,time
from google.appengine.ext import db
from google.appengine.api import images
from string import letters
##########################################################
##########################################################


template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
                               autoescape=True)
#util#####################################################
##########################################################
def valid(string):
    if len(string) <1:
        return False
    if " " in string:
        return False
    return True
def validRequest():
    return True
def validOffer():
    return True   
def validUser():
    return True 
def doesExist(user,pas):
    u=db.GqlQuery("SELECT * FROM User") #WHERE name="+"'"+user+"'" )
    for i in u:
        if i.password ==pas and i.name==user:
            return True
    return False
def validPassword(password,h):
    salt = h.split(':')[1]
    return h == make_pw_hash(password, salt)
def make_salt(length = 16):
    return ''.join(random.choice(letters) for x in xrange(length))
    return salt
def make_pw_hash(pw,salt = None):
    if not salt:
        salt = make_salt()
    h = hashlib.sha256(salt + pw ).hexdigest()
    r = h + ":" + salt
    return r
def generateToken(username):
    h = hashlib.sha256(str(902183749) + username ).hexdigest()
    return h


###
#DATABASE
##########################################################
##########################################################
#Users
class User(db.Model):
    username = db.StringProperty(required=True)
    password = db.StringProperty(required=True)
    user_type = db.StringProperty(required=True)
    comment = db.TextProperty()
    @classmethod
    def byName(cls, name):
        u = User.all().filter('username =', name).get()
        return u
    @classmethod
    def register(cls, name, pw, usertype,comment):
        pw_hash = make_pw_hash(pw)
        return User(username = name,
                    password = pw_hash,
                    user_type = usertype,
                    comment = comment
                    )
    @classmethod
    def login(cls, name, pw):
        u = cls.byName(name)
        if u and validPassword(pw, u.password):
            return u
#Items
class Offering(db.Model):
    item_name = db.StringProperty(required=True)
    item_cubics = db.StringProperty(required=True)
    item_price = db.StringProperty(required=True)
    seller_id = db.StringProperty()     #make required
    comment = db.TextProperty()
    item_image=db.BlobProperty()
    requested_by = db.StringProperty() 
    #aproved or not
    status = db.StringProperty(required=True)
    item_name_original = db.StringProperty()
    item_cubics_original = db.StringProperty()
    item_price_original = db.StringProperty()
    comment_original = db.TextProperty()
    visible = db.StringProperty()
    date = db.DateTimeProperty(auto_now=True, auto_now_add=True) 
    @classmethod
    def addNew(cls, name, cubics, price, comment, user_id,status="pending",requested_by="",visible="yes"):
        return Offering(item_name = name,
                    item_cubics = cubics,
                    item_price = price,
                    comment = comment,
                    seller_id = user_id,
                    status=status,
                    requested_by=requested_by,
                    item_name_original = name,
                    item_cubics_original = cubics,
                    item_price_original = price,
                    comment_original = comment,
                    visible = visible
                    )

class Request(db.Model):
    item_name = db.StringProperty(required=True)
    item_cubics = db.StringProperty(required=True)
    item_price = db.StringProperty()
    comment = db.TextProperty()
    requester_id = db.StringProperty()   #make required
    from_inventory = db.StringProperty()
    #
    request_sent = db.StringProperty()  # username of seller to which order is sent
    item_name_original = db.StringProperty()
    item_cubics_original = db.StringProperty()
    item_price_original = db.StringProperty()
    comment_original = db.TextProperty()
    date = db.DateTimeProperty(auto_now=True, auto_now_add=True) 
    @classmethod
    def addNew(cls, name, cubics, price, comment, user_id,from_inventory="no",request_sent=""):
        return Request(item_name = name,
                    item_cubics = cubics,
                    item_price = price,
                    comment = comment,
                    requester_id = user_id,
                    from_inventory = from_inventory,
                    request_sent = request_sent,
                    item_name_original = name,
                    item_cubics_original = cubics,
                    item_price_original = price,
                    comment_original = comment
                    )


##########################################################
##########################################################
class Handler(webapp2.RequestHandler):
    def write (self,*a,**kw):
        self.response.out.write(*a,**kw)
    def render_str(self, template, **params):
        t= jinja_env.get_template(template)
        return t.render(params)
    def render(self, template,**kw):
        self.write(self.render_str(template,**kw))

class RequestPage(Handler):
    def render_main(self):  #,title="",post="",error="",creator="",new=True)
        #articlesObj=db.GqlQuery("SELECT * FROM Article ORDER BY date DESC LIMIT 6" )
        self.render("request.html")#,user=user,events=events,articles=articles)
    def get(self,order_id):
        #self.write("hello")
        #q=self.request.get("q")
        #self.render_main()
        offer = Offering.get_by_id(int(order_id))
        self.render("request.html",offer=offer)
    def post(self,order_id):
        offer = Offering.get_by_id(int(order_id))
        seller = offer.seller_id

        item_name = self.request.get('name')
        item_cubics = self.request.get('cubics')
        item_price = self.request.get('price')
        comment = self.request.get('comment')
        user = self.request.cookies.get('username')
        if validOffer():
            req = Request.addNew(item_name, item_cubics, item_price, comment, user,from_inventory=seller)
            req.put()
            # add requested_by in offering
            if offer.requested_by=="":
                
                offer.requested_by +="Requested: " + user
            else:
                offer.requested_by  +=  " , " + user
            offer.put()

        self.redirect('/buyer')  
class BuyerPage(Handler):
    def render_main(self):  #,title="",post="",error="",creator="",new=True)
        #articlesObj=db.GqlQuery("SELECT * FROM Article ORDER BY date DESC LIMIT 6" )
        self.render("buyer.html")#,user=user,events=events,articles=articles)
    def get(self):
        #self.write("hello")
        #q=self.request.get("q")
        #self.render_main()
        user = self.request.cookies.get('username')
        if user:
            offers=db.GqlQuery("select * from Offering  where status = 'approved' and visible = 'yes' ")
            requests = db.GqlQuery(" select * from Request where requester_id = '"+user+"'")
            self.render("buyer.html",offers=offers,requests=requests)
        else:
            self.redirect('/login')  
    def post(self):
        user = self.request.cookies.get('username')
        item_name = self.request.get('name')
        item_cubics = self.request.get('cubics')
        item_price = self.request.get('price')
        comment = self.request.get('comment')
        action_type = self.request.get('actionType')

        if action_type == "adding":
            if validOffer():
                req = Request.addNew(item_name, item_cubics, item_price, comment, user)
                req.put()

        ## Edit
        req_id = self.request.get('req_id')
        

        if action_type == "editing":
            modified_req = Request.get_by_id(int(req_id))
            modified_req.item_name = item_name
            modified_req.item_price = item_price
            modified_req.item_cubics = item_cubics
            modified_req.comment = comment
            modified_req.put()
        if action_type == "deleting":
            modified_req = Request.get_by_id(int(req_id))
            modified_req.delete()

        if action_type == "request":
            

            self.redirect('/request/'+str(req_id)  )
        else:
            self.redirect('/buyer')  
class BuyerOrdersPage(Handler):
    def render_main(self):  #,title="",post="",error="",creator="",new=True)
        #articlesObj=db.GqlQuery("SELECT * FROM Article ORDER BY date DESC LIMIT 6" )
        self.render("buyer_orders.html")#,user=user,events=events,articles=articles)
    def get(self):
        #self.write("hello")
        #q=self.request.get("q")
        #self.render_main()
        user = self.request.cookies.get('username')
        if user:
            requests = db.GqlQuery(" select * from Request where requester_id = '"+user+"'")
            self.render("buyer_orders.html",requests=requests)
        else:
            self.redirect('/login')  
    def post(self):
        user = self.request.cookies.get('username')
        item_name = self.request.get('name')
        item_cubics = self.request.get('cubics')
        item_price = self.request.get('price')
        comment = self.request.get('comment')
        #
        action_type = self.request.get('actionType')

        if action_type == "adding":
            if validOffer():
                req = Request.addNew(item_name, item_cubics, item_price, comment, user)
                req.put()

        ## Edit
        req_id = self.request.get('req_id')
        

        if action_type == "editing":
            modified_req = Request.get_by_id(int(req_id))
            modified_req.item_name = item_name
            modified_req.item_price = item_price
            modified_req.item_cubics = item_cubics
            modified_req.comment = comment
            modified_req.put()
        if action_type == "deleting":
            modified_req = Request.get_by_id(int(req_id))
            modified_req.delete()

        if action_type == "request":
            

            self.redirect('/request/'+str(req_id)  )
        else:
            self.redirect('/buyerorders')  
class BuyerPage2(Handler):
    def render_main(self):  #,title="",post="",error="",creator="",new=True)
        #articlesObj=db.GqlQuery("SELECT * FROM Article ORDER BY date DESC LIMIT 6" )
        self.render("buyer.html")#,user=user,events=events,articles=articles)
    def get(self,username):
        #self.write("hello")
        #q=self.request.get("q")
        #self.render_main()

        offers=db.GqlQuery("select * from Offering ")
        #own_requests = 
        self.render("buyer.html",offers=offers)
    def post(self):
        pass

class AdminOrdersScreen(Handler):
    def render_main(self):  #,title="",post="",error="",creator="",new=True)
        #articlesObj=db.GqlQuery("SELECT * FROM Article ORDER BY date DESC LIMIT 6" )
        self.render("admin_orders.html")#,user=user,events=events,articles=articles)
    def get(self):
        #self.write("hello")
        #q=self.request.get("q")
        #self.render_main()

        orders=db.GqlQuery("select * from Request ")
        sellers=db.GqlQuery("select * from User where user_type = 'seller' ")
        self.render("admin_orders.html",orders=orders,sellers=sellers)

    def post(self):
        name = self.request.get('name')
        price = self.request.get('price')
        cubics = self.request.get('cubics')
        comment = self.request.get('comment')
        user_id = self.request.get('user_id')
        action_type = self.request.get('actionType')

        if action_type == "editing":
            offer_id = self.request.get('offer_id')
            modified_req = Request.get_by_id(int(offer_id))
            modified_req.username = name
            modified_req.comment = comment
            modified_req.put()
        if action_type == "deleting":
            offer_id = self.request.get('offer_id')
            modified_req = Request.get_by_id(int(offer_id))
            modified_req.delete()

        if action_type == "sending":
            selected_seller = self.request.get('selected_seller')
            offer_id = self.request.get('offer_id')

            order = Request.get_by_id(int(offer_id))
            order.request_sent = selected_seller
            order.item_name = name
            order.item_price = price
            order.item_cubics = cubics
            order.comment = comment
            order.put()                             #TODO update order
            
           

        user = self.request.cookies.get('username')
        self.redirect('/adminorders')

class AdminUsersScreen(Handler):
    def render_main(self):  #,title="",post="",error="",creator="",new=True)
        #articlesObj=db.GqlQuery("SELECT * FROM Article ORDER BY date DESC LIMIT 6" )
        self.render("admin_users.html")#,user=user,events=events,articles=articles)
    def get(self):
        #self.write("hello")
        #q=self.request.get("q")
        #self.render_main()

        buyers=db.GqlQuery("select * from User where user_type = 'buyer' ")
        sellers=db.GqlQuery("select * from User where user_type = 'seller' ")
        admins=db.GqlQuery("select * from User where user_type = 'admin' ")

        
        self.render("admin_users.html",buyers=buyers,sellers=sellers,admins=admins)
    def post(self):
        name = self.request.get('name')
        comment = self.request.get('comment')
        user_id = self.request.get('user_id')
        action_type = self.request.get('actionType')

        if action_type == "editing":
            modified_user = User.get_by_id(int(user_id))
            modified_user.username = name
            modified_user.comment = comment
            modified_user.put()
        if action_type == "deleting":
            modified_user = User.get_by_id(int(user_id))
            modified_user.delete()
           

        user = self.request.cookies.get('username')
        self.redirect('/adminusers')
class AdminScreen(Handler):
    def render_main(self):  #,title="",post="",error="",creator="",new=True)
        #articlesObj=db.GqlQuery("SELECT * FROM Article ORDER BY date DESC LIMIT 6" )
        self.render("admin.html")#,user=user,events=events,articles=articles)
    def get(self):
        #self.write("hello")
        #q=self.request.get("q")
        #self.render_main()

        approved_offers=db.GqlQuery("select * from Offering where status = 'approved' ")
        pending_offers=db.GqlQuery("select * from Offering where status = 'pending' ")
        buyers=db.GqlQuery("select * from User where user_type = 'buyer' ")
        sellers=db.GqlQuery("select * from User where user_type = 'seller' ")
        requests=db.GqlQuery("select * from Request  ")

        
        self.render("admin.html",approved_offers=approved_offers,pending_offers=pending_offers,buyers=buyers,sellers=sellers,requests=requests)
    def post(self):
        name = self.request.get('name')
        cubics = self.request.get('cubics')
        price = self.request.get('price')
        comment = self.request.get('comment')
        offer_id = self.request.get('offer_id')
        action_type = self.request.get('actionType')

        if action_type == "approving":
            modified_offer = Offering.get_by_id(int(offer_id))
            modified_offer.item_name = name
            modified_offer.item_price = price
            modified_offer.item_cubics = cubics
            modified_offer.comment = comment
            modified_offer.status = "approved"
            modified_offer.put()

        if action_type == "editing":
            modified_offer = Offering.get_by_id(int(offer_id))
            modified_offer.item_name = name
            modified_offer.item_price = price
            modified_offer.item_cubics = cubics
            modified_offer.comment = comment
            modified_offer.put()
        if action_type == "deleting":
            modified_offer = Offering.get_by_id(int(offer_id))
            modified_offer.delete()
        if action_type == "visibility":
            modified_offer = Offering.get_by_id(int(offer_id))
            v =  modified_offer.visible
            if v == "yes":
                v = "no"
            else:
                v = "yes"
            modified_offer.visible = v
            modified_offer.put()

        if action_type == "adding" and validOffer():
            user = self.request.cookies.get('username')
            offer = Offering.addNew(name, cubics, price, comment, user)
            offer.status ="approved"
            offer.put()
           

        user = self.request.cookies.get('username')
        self.redirect('/admin')

##########################################################
##########################################################
class CreateUser(Handler):
    def get(self):
        self.render("create_user.html")
    def post(self):
        user_name = self.request.get('username')
        user_pass = self.request.get('password')
        user_type = self.request.get('usertype')
        comment = self.request.get('comment')
        if validUser():
            user = User.register(user_name, user_pass, user_type, comment)
            user.put()
        
        self.redirect('/createuser')
class SellerPage(Handler):
    def get(self):
        user = self.request.cookies.get('username')
        if user:
            requests = db.GqlQuery("select * from Request where request_sent ='"+ user +"'")
            offers=db.GqlQuery("select * from Offering where seller_id ='"+ user +"'")
            self.render("seller.html",offers=offers,requests=requests)
        else:
            self.redirect("/login")
    def post(self):

        user = self.request.cookies.get('username')
        name = self.request.get('name')
        cubics = self.request.get('cubics')
        price = self.request.get('price')
        comment = self.request.get('comment')
        offer_id = self.request.get('offer_id')
        action_type = self.request.get("actionType")

        if action_type == "adding" and validOffer():
            offer = Offering.addNew(name, cubics, price, comment, user)
            offer.put()
        if action_type == "editing":
            modified_offer = Offering.get_by_id(int(offer_id))
            modified_offer.item_name = name
            modified_offer.item_price = price
            modified_offer.item_cubics = cubics
            modified_offer.comment = comment
            modified_offer.put()
        if action_type == "deleting":
            offer = Offering.get_by_id(int(offer_id))
            offer.delete()
        
        self.redirect('/seller')
class AddOffer(Handler):
    def get(self):
        self.render("add_offer.html")
    def post(self):
        item_name = self.request.get('name')
        item_cubics = self.request.get('cubics')
        item_price = self.request.get('price')
        requester_id = "20"
        comment = self.request.get('comment')
        user = self.request.cookies.get('username')
        if validOffer():
            offer = Offering.addNew(item_name, item_cubics, item_price, comment, user)
            offer.put()
        
        self.redirect('/seller')
class AddRequest(Handler):
    def get(self):
        self.render("add_request.html")
    def post(self):
        item_name = self.request.get('name')
        item_cubics = self.request.get('cubics')
        item_price = self.request.get('price')
        requester_id = self.request.get('id')
        comment = self.request.get('comment')
        if validRequest():
            req = Request.addNew(item_name, item_cubics, item_price, requester_id, comment)
            req.put()
        
        self.redirect('/buyer')
class LogIn(Handler):
    def get(self):
        self.render("login.html")
    def post(self):
        username=self.request.get('username')
        action_type = self.request.get("actionType")

        if action_type == "change" :
            current_pass = self.request.get("old_password")
            newp1 = self.request.get("new_password1")
            newp2 = self.request.get("new_password2")
            if newp1!=newp2:
                self.render("login.html",user=username) #TODO add pass didnt math error message
            else:
                if valid(username) and valid(current_pass):
                    u = User.login(username, current_pass)
                    if u:
                        newp = make_pw_hash(newp1)
                        u.password = newp
                        u.put()
                        self.response.set_cookie('username', username)
                        self.response.set_cookie('token', generateToken(username))
                        if u.user_type == "buyer":
                            self.redirect('/buyer')
                        if u.user_type == "seller":
                            self.redirect('/seller')
                        if u.user_type == "admin":
                            self.redirect('/admin')
        if action_type == "login":
            password=self.request.get('password')
            if valid(username) and valid(password):
                #u=db.GqlQuery("SELECT * FROM User WHERE username = 'myname' AND password = 'mypass'".replace("myname",username).replace("mypass",password))
                u = User.login(username, password)
                if u:
                    self.response.set_cookie('username', username)
                    self.response.set_cookie('token', generateToken(username))
                    if u.user_type == "buyer":
                        self.redirect('/buyer')
                    if u.user_type == "seller":
                        self.redirect('/seller')
                    if u.user_type == "admin":
                        self.redirect('/admin')
                else:
                    self.render("login.html")
            else:
                self.render("login.html",user=username,pas=password)

class ProfilePage(Handler):
    def get(self,name):   
        pass
    def post(self, num):
        pass

class GetNavigation(Handler):
    def get(self):   
        u=self.request.cookies.get('username')
        self.render("navigation.html",user=u)
    def post(self):
        pass
class GetFooter(Handler):
    def get(self):   
        self.render("footer.html")
    def post(self):
        pass

        
##########################################################
##########################################################

app = webapp2.WSGIApplication([
    ('/buyer', BuyerPage), ('/buyerorders', BuyerOrdersPage),('/addoffer', AddOffer), ('/createuser', CreateUser),  ('/login', LogIn),
      ('/seller', SellerPage),  ('/admin', AdminScreen),   ('/adminusers', AdminUsersScreen),('/inventory/(\w+)', BuyerPage2),
        ('/request/(\d+)', RequestPage), ('/adminorders', AdminOrdersScreen)
], debug=True)
