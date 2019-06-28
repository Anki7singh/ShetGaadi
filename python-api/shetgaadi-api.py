from flask import Flask, jsonify, request
from flask.ext.pymongo import PyMongo
from flask_pymongo import PyMongo
from flask_cors import CORS
import jwt
from functools import wraps
from flask.ext.uploads import UploadSet, configure_uploads, IMAGES
import requests
import json 
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# mail sending config start here
me = "wcyber23@gmail.com"
my_password = "ANKITK.AS51"
# you = "ankitk.as51@gmail.com"
msg = MIMEMultipart('alternative')
msg['From'] = me
# mail config end

app= Flask(__name__)
CORS(app)
app.config['MONGO_DBNAME']='shetgaadi'
app.config['MONGO_URI']='mongodb://127.0.0.1:27017/shetgaadi'
mongo=PyMongo(app)
photos = UploadSet('photos', IMAGES)
app.config['UPLOADED_PHOTOS_DEST'] = 'static/'
configure_uploads(app, photos)

app.config['SECRET_KEY'] = 'secret'


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        data = request.headers
        print (data)

        if 'x_access_token' in request.headers:
            token = request.headers['x_access_token']
        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401
        try: 
            data = jwt.decode(token, app.config['SECRET_KEY'])
            print (data)
            current_user = mongo.db.users.find_one({'phone_number':data['phone_number']})
            print (current_user)
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401
        if not current_user:
            return jsonify({'message' : 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/weather',methods=['POST'])
def weather():
	if request.method=='POST':
		cityName=request.json['cityName']
		print(cityName)
		# cityName="nashik"
	r = requests.get("https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&APPID=d7a09b36e7fa04d2e58738e66a4322df",timeout=5)
	d = json.loads(r.text)
	# print( d['main'])
	print(type(d))

	print(d['main'])
	return jsonify(d)

@app.route('/bookingRealease',methods=['POST'])
def bookingRealease():
	resources=mongo.db.resources
	if request.method=='POST':
		resourceNumber=request.json['resourceNumber']
		print(resourceNumber)
		if resources.find_one({'resourceNumber':resourceNumber}):
			resources.update({
				'resourceNumber':resourceNumber
				},
				{ '$set':{
				"resourceStatus":"available"
				}}
				)
			return jsonify({'success':'Resource status change.'})




@app.route('/getMybooking',methods=['POST'])
@token_required
def getMybooking(current_user):
	trip=mongo.db.trip
	if request.method=='POST':
		ownerid=request.json['userid']
		username=request.json['username']
		UsermobileNo=request.json['usermobile']
		output1=[]
		output=[]
		print("before*******",username)
		print(ownerid)
		for q in (trip.find({'ownerid':ownerid, 'resourceOwnBy':username})) or (trip.find({'userMobileNumber':UsermobileNo})) :
			output.append({'useremail':q['useremail'],'resourceNumber':q['resourceNumber'],'nameofuser':q['nameofuser'],'userMobileNumber':q['userMobileNumber'],'resourceOwnBy':q['resourceOwnBy'],'resource':q['resource'],'noOfDays':q['noOfDays'],'bookingDate':q['bookingDate'],'paymentMode':q['paymentMode'],'picklocation':q['picklocation'],'droplocation':q['droplocation'],'ownerMobileNumber':q['ownerMobileNumber'],'ownerid':q['ownerid'],'owneremail':q['owneremail'],'Requeststatus':q['Requeststatus']})
			print("insideeeeeeeeee\n")
			print(output)

		for q in trip.find({'userMobileNumber':UsermobileNo}):
			output1.append({'useremail':q['useremail'],'resourceNumber':q['resourceNumber'],'nameofuser':q['nameofuser'],'userMobileNumber':q['userMobileNumber'],'resourceOwnBy':q['resourceOwnBy'],'resource':q['resource'],'noOfDays':q['noOfDays'],'bookingDate':q['bookingDate'],'paymentMode':q['paymentMode'],'picklocation':q['picklocation'],'droplocation':q['droplocation'],'ownerMobileNumber':q['ownerMobileNumber'],'ownerid':q['ownerid'],'owneremail':q['owneremail'],'Requeststatus':q['Requeststatus']})
			print("insideeeeeeeeee\n")
			print(output)
		if len(output1) != 0:
			return jsonify(output1)
		if len(output) != 0:
			return jsonify(output)


@app.route('/getMybookingRequest',methods=['POST'])
# @token_required
def getMybookingRequest():
	if request.method=='POST':
		ownerID=request.data
		ownerID=ownerID.decode("UTF-8")
		print(ownerID)
		print("\n\n\nheyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",ownerID)
		resourceOrderAndUsed=mongo.db.resourceOrderAndUsed
		output=[]
		for q in resourceOrderAndUsed.find({'ownerID':ownerID}):
			output.append({'useremail':q['useremail'],'userId':q['userId'],'userMobileNumber':q['userMobileNumber'],'resourceOwnBy':q['resourceOwnBy'],'noOfDays':q['noOfDays'],'userId':q['userId'],'resource':q['resource'],'ownerID':q['ownerID'],'nameofuser':q['name'],'bookingDate':q['bookingDate'],'picklocation':q['picklocation'],'droplocation':q['droplocation'],'paymentMode':q['paymentMode'],'resourceNumber':q['resourceNumber']})
		return jsonify(output)
	return jsonify({'success':'false'})
	
	# making changes here if someting goes wrong delete  other code and uncomment this code.
		# q = resourceOrderAndUsed.find_one({'ownerID':ownerID})
		# if q:
		# 	output=[]
			# output.append({'resourceOwnBy':q['resourceOwnBy'],'noOfDays':q['noOfDays'],'userId':q['userId'],'resource':q['resource'],'ownerID':q['ownerID'],'nameofuser':q['name'],'bookingDate':q['bookingDate'],'picklocation':q['picklocation'],'droplocation':q['droplocation'],'paymentMode':q['paymentMode'],'resourceNumber':q['resourceNumber']})
		# 	return jsonify(output)
		# else:
		# 	return jsonify({'success':'false'})



@app.route('/bookingprocess',methods=['POST'])
# @token_required
# def bookingprocess( current_user):
def bookingprocess():
	resources=mongo.db.resources
	output=[]
	print(">>>>>>>>>>")
	if request.method=='POST':
		resourceId=request.data
		dataid=resourceId.decode("UTF-8")
		print(dataid)
		res = resources.find_one({'resourceNumber':dataid})
		if res:
			output.append({'resource':res['resource'],'ownerID':res['ownerID'],'resourceNumber':res['resourceNumber'],'resourceStatus':res['resourceStatus'],'resourceOwnBy':res['resourceOwnBy'],'imgs':res['imgs']})
			print(output)
		else:
			output = "No such name"
		return jsonify(output)


@app.route('/bookingMakeRequest',methods=['POST'])
def bookingMakeRequest():
	resourceRequest=mongo.db.resourceOrderAndUsed
	resources=mongo.db.resources
	if request.method=='POST':
		bookingdata=request.data
		print (type(bookingdata))
		dataget= json.loads(bookingdata.decode('utf-8'))
		resouceget=dataget["resouceget"][0]
		del dataget['resouceget']
		dataget.update(resouceget)
		print(dataget.keys())
		print(dataget['resourceNumber'])

		if resources.find_one({'resourceNumber':dataget['resourceNumber']}):
			resources.update({
				'resourceNumber':dataget['resourceNumber']
				},
				{ '$set':{
				"resourceStatus":"requested"
				}}

				)
			user_id=resourceRequest.insert_one(dataget)
			if user_id:
				return jsonify({'success':'true','message':'Resource request sent to user.'})
		# here i  update resource collection in requested mode 

		return jsonify({'success':'false','message':'Resource request not sent, Something goes wrong.'})


@app.route('/acceptRequest',methods=['POST'])
def acceptRequest():
	resources=mongo.db.resources
	resourceRequest=mongo.db.resourceOrderAndUsed
	tripBook=mongo.db.trip
	print (request.get_json())
	tripBook.insert_one(request.get_json())
	ownerid=request.json['ownerid']
	useremail=request.json['useremail']

	resourceNumber=request.json['resourceNumber']
# some changes are made here
	username=request.json['nameofuser']
	contactnumber=request.json['ownerMobileNumber']
	usermobilenumber=request.json['userMobileNumber']

	if resourceRequest.remove({'ownerID':ownerid}):
		print("Request accepted and move to trip info.")

		msg['To'] = useremail
		you=useremail
		msg['Subject'] = "Shetgaadi: Resource request Accepted."

		print(resourceNumber,"\n",useremail)
		res = resources.find_one({'resourceNumber':resourceNumber})
		if res:
			if resources.update({'resourceNumber':resourceNumber},{ '$set':{"resourceStatus":"booked"}}):
				print("heyyyyyyyyyyyyy, Resource status updated\n")
				html = '<html><body><p style="color:green;font-size:20px">Hi <b>'+username+', </b>Your resource request for resource <b>'+resourceNumber+ ' </b>aceepted by the user!</p> <p style="font-size:16px">Please contact with resource owner using Contact number: <b>'+contactnumber+'</b>.<br>Booking Deatils<br><br><br> Thank you for using Shetgaadi.</p></body></html>'
				# html = '<html><body><p style="color:green;font-size:20px">Hi <b>'+username+', </b>Your resource request for resource <b>'+resourceNumber+ ' </b>aceepted by the user!</p> <p style="font-size:16px">Please contact with resource owner using Contact number: <b>'+contactnumber+'</b>.<br>Booking Deatils<br> '+str(request.get_json())+'<br><br> Thank you for using Shetgaadi.</p></body></html>'
				# html = '<html><body><p>Hi'+username+', Your resource request rejected by the user!</p></body></html>'
				part2 = MIMEText(html, 'html')
				msg.attach(part2)
				s = smtplib.SMTP_SSL('smtp.gmail.com')
				s.login(me, my_password)
				s.sendmail(me, you, msg.as_string())
				s.quit()
				print("notification mail sent")
				return jsonify({'success':'true','message':'Resource request Accepted by user.'})
	return jsonify({'success':'false','message':'Something goes wrong.'})



@app.route('/rejectRequest',methods=['POST'])
def rejectRequest():
	resources=mongo.db.resources
	resourceRequestReject=mongo.db.resourceOrderAndUsed

	# resource=request.data
	email=request.json['key1']
	resource=request.json['key2']
	username=request.json['key3']
	UserMobileNumber=request.json['key4']
	msg['To'] = email
	you=email
	print('************\n',UserMobileNumber)
	msg['Subject'] = "Shetgaadi: Resource request rejected."

	print(resource,"\n",email)
	res = resources.find_one({'resourceNumber':resource})
	# print(res)
	if res:
		print("res",resource)
		if resources.update({'resourceNumber':resource},{ '$set':{"resourceStatus":"available"}}):
			if resourceRequestReject.remove({'resourceNumber':resource,'userMobileNumber':UserMobileNumber}):
				print("Request accepted and move to trip info.")
				r = requests.get("https://www.fast2sms.com/dev/bulk?authorization=8XBcf62v3nZ0QMIArG1EYoL47bDpd9FsPegHumKaRqwtkjUx5NEWw2vzC1XidB0Nc8umPq64pTxgY3DA&sender_id=FSTSMS&message=Message from Shetgaadi Team. "+username+" request for "+resource+" rejected.&language=english&route=p&numbers="+UserMobileNumber,timeout=5)
				if r:
					print("sms sent to the user")
				print("heyyyyyyyyyyyyy, Resource status updated\n")
				html = '<html><body><p style="color:red">Hi <b>'+username+', </b>Your resource request for resource <b>'+resource+ ' </b>rejected by the user!</p> <p>Please try  to book another resource.<br> Thank you for using Shetgaadi.</p></body></html>'
				# html = '<html><body><p>Hi'+username+', Your resource request rejected by the user!</p></body></html>'
				part2 = MIMEText(html, 'html')
				msg.attach(part2)
				s = smtplib.SMTP_SSL('smtp.gmail.com')
				s.login(me, my_password)
				s.sendmail(me, you, msg.as_string())
				s.quit()
				print("notification mail sent")
				return jsonify({'success':'true','message':'Resource request rejected by user.'})
	return jsonify({'success':'false','message':'Something goes wrong.'})
# sms sending
  # 'https://www.fast2sms.com/dev/bulk?authorization=8XBcf62v3nZ0QMIArG1EYoL47bDpd9FsPegHumKaRqwtkjUx5NEWw2vzC1XidB0Nc8umPq64pTxgY3DA&sender_id=FSTSMS&message=This is test message from Shetgaadi Team.&language=english&route=p&numbers='



@app.route('/getresources',methods=['GET'])
def getresources():
	resources=mongo.db.resources
	output=[]
	for q in resources.find():
		# temp={}
		# temp['id']=str(q['_id'])
		# temp['resource']=q['resource']
		# temp['resourceNumber']=q['resourceNumber']		
		# temp['resourceStatus']=q['resourceStatus']
		# temp['resourceNumber']=q['resourceOwnBy']		
		# temp['imgs']=q['imgs']
		# output.append(temp)
		output.append({'resId':str(q['_id']),'resource':q['resource'],'resourceNumber':q['resourceNumber'],'resourceStatus':q['resourceStatus'],'resourceOwnBy':q['resourceOwnBy'],'imgs':q['imgs']})
		# print(jsonify( output))		
	return jsonify(output)

@app.route('/adduser',methods=['POST'])
def adduser():
	user=mongo.db.users
	if request.method=='POST':
		name=request.json['name']
		phone_number=request.json['phone_number']
		email=request.json['email']
		password=request.json['password']

		if user.find_one({'name':name}) or user.find_one({'phone_number':phone_number}):
			return jsonify({'fail':'User available. Please add another details .'})
		else:
			user_id=user.insert({'name':name,'phone_number':phone_number,'email':email,'password':password})
			# newuser=user.find_one({'phone_number':phone_number})
			# output={'name':newuser['name'],'phone_number':newuser['phone_number'],'email':newuser['email']}
			# return jsonify(output)
			return jsonify({'success':'true','message':'Account created successfully'})


@app.route('/loginuser',methods=['POST'])
def loginuser():
	user=mongo.db.users
	if request.method=='POST':
		phone_number=request.json['phone_number']
		password=request.json['password']
		sendUserData=[]

		newuser=user.find_one({'phone_number':phone_number})
		if newuser:
			userVarified=user.find_one({'phone_number':phone_number,'password':password})
			if userVarified:
				sendUserData.append({'email':userVarified['email'],'name':userVarified['name'],'phone_number':userVarified['phone_number'],'id':str(userVarified['_id'])})
				print(sendUserData)
				token = jwt.encode({'phone_number':newuser['phone_number']}, app.config['SECRET_KEY'])				
				return jsonify({'token' : token.decode('UTF-8'),'data':sendUserData})		
				# return jsonify({'success':'true','message':'Login successful'})
			else:
				return jsonify({'success':'false','message':'Password is wrong.'})
		else:
			return jsonify({'success':'false','message':'Phone number is wrong.'})




# @app.route('/adddriver',methods=['POST'])
# def adddriver():
# 	driver=mongo.db.driver
# 	if request.method=='POST':
# 		name=request.json['name']
# 		phone_number=request.json['phone_number']
# 		email=request.json['email']
# 		vehicle_number=request.json['vehicle_number']
# 		driving_id=request.json['driving_id']
# 		password=request.json['password']

# 		if driver.find_one({'name':name}) or driver.find_one({'phone_number':phone_number}) or driver.find_one({'driving_id':driving_id}) :
# 			return jsonify("User found. Please goto login.")
# 		else:
# 			user_id=driver.insert({'name':name,'phone_number':phone_number,'email':email,'vehicle_number':vehicle_number,'driving_id':driving_id,'password':password})
			# newuser=driver.find_one({'phone_number':phone_number})
			# output={'name':newuser['name'],'phone_number':newuser['phone_number'],'vehicle_number':newuser['vehicle_number']}
			# return jsonify(output)
			# return jsonify({'success':'true','message':'Account created successfully'})



# @app.route('/logindriver',methods=['POST'])
# def logindriver():
# 	driver=mongo.db.driver
# 	if request.method=='POST':
# 		phone_number=request.json['phone_number']
# 		password=request.json['password']

# 		newuser=driver.find_one({'phone_number':phone_number})
# 		if newuser:
# 			if driver.find_one({'password':password}):
# 				return jsonify({'success':'true','message':'Login successful'})
# 			else:
# 				return jsonify({'success':'false','message':'Password is wrong.'})
# 		else:
# 			return jsonify({'success':'false','message':'Phone number is wrong.'})



@app.route('/addResource',methods=['POST'])
@token_required
def addResource(current_user):
	resources=mongo.db.resources
	if request.method=='POST':
		name=request.json['name']
		resourceNumber=request.json['resourceNumber']

		ownerID=request.json['userID']
		mobilenumber=request.json['mobilenumber']
		print(name)
		print(resourceNumber)
		resourceStatus=request.json['resourceStatus']
		resourceOwnBy=request.json['resourceOwnBy']
		imgs=request.json['avatar']
		print(imgs)
		# password=request.json['password']

		if resources.find_one({'resourceNumber':resourceNumber}):
			return jsonify({'fail':'Resource available. Please add another .'})
		else:
			user_id=resources.insert({'resource':name,'mobileNumber':mobilenumber,'ownerID':ownerID,'resourceNumber':resourceNumber,'resourceStatus':resourceStatus,'resourceOwnBy':resourceOwnBy,'imgs':imgs})
			# newuser=driver.find_one({'phone_number':phone_number})
			# output={'name':newuser['name'],'phone_number':newuser['phone_number'],'vehicle_number':newuser['vehicle_number']}
			# return jsonify(output)
			return jsonify({'success':'true','message':'Resource add successfully'})



if __name__=='__main__':
	app.run(debug=True)



