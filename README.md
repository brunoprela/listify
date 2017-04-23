# Listify

https://listify-team-phil.herokuapp.com/

Project by Spencer Kim, Max Lancaster, Bruno Prela and Phillip Ou

## Deploy
git clone git@github.com:brunoprela/listify.git

npm install

sudo mongod

npm start

go to http://localhost:3000/ in the browser

## Caveats
Passwords are currently stored in plain text.

The feed of rankings you participate in don't yet display the number of contributors.

We currently don't display validation errors when we create Ranking and Consensus objects.

You cannot toggle public or private yet.

When a user first logs in, he/she is directed to a page to create a ranking instead of a dashboard to view all of his/her rankings which have reached consensus.

There are currently no capabilities for locking a consensus and ending polling. Thus, there isn't yet functionality for viewing the consensus of a ranking.

## Routes

Once running locally, http://localhost:3000/login for the login page. Note that we haven't yet implemented middleware to detect whether the user is authenticated. 

http://localhost:3000/rankings for creating an empty ranking

http://localhost:3000/rankings/edit for editing an empty ranking

http://localhost:3000/edit/:consensus_id for submitting a ranking to an open ranking

http://localhost:3000/consensus to view your rankings which have reached consensus

## Command Line Insights
Registering a user outputs a JSON object of all Users in the system

When you create a ranking for the first time by adding suggestions and clicking the green OK button, you are automatically directed to a page to create the first submission to that ranking. Only after you (the creator) submit the first response on this page the models are updated. Drag and drop your selections, and click the green OK button. In the command line you should see the consensus document created with the title you created, your username in the creator field, and a list of ObjectIds for the rankings which have been submitted to this consensus. At this point, there should only be one - your first submission.

After submitting this first ranking, you should see a dialog box appear that will contain the shareable link to this ranking so that other users can make submissions. At the moment, this functionality doesn't exist.
