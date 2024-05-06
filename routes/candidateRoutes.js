const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Candidate = require('../models/candidate');

// route to Candidates
// router.get('/home',  verifyToken , async (req, res) => {
//     try {
//         const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId);
//         res.render('loggedhome', { user });
//       } catch (err) {
//         console.error(err);
//         res.redirect('/user/login');
//       }
//   });

const checkAdminRole = async (userID) => {
   try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
   }catch(err){
        return false;
   }
}

// POST route to add a candidate

router.get('/registration', verifyToken,  (req, res) => {
    res.render('candidater_registration');
  });

router.post('/registration', verifyToken, async (req, res) =>{
    try{
        
            const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
            const userId = '6633c5d85d4be76438e5a91c';
            
        if(!(await checkAdminRole(userId)))
            return res.status(403).json({message: 'user does not have admin role'});

        const data = req.body // Assuming the request body contains the candidate data

        // Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.render('candidate_reg_done', { response });
        // res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.put('/:candidateID', verifyToken, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID; // Extract the id from the URL parameter
        const updatedCandidateData = req.body; // Updated data for the person

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.delete('/:candidateID', verifyToken, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID; // Extract the id from the URL parameter

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// let's start voting
router.get('/vote/candidates', verifyToken, async  (req, res) => {
    const candidates = await Candidate.find();
    res.render('cand_vote', { candidates });
  });   
// // router.post('/vote/:candidateID', verifyToken, async (req, res)=>{
//     router.post('/vote/candidates', verifyToken, async (req, res)=>{
//     // no admin can vote
//     // user can only vote once
   

//     // candidateID = req.params.candidateID;
//     const name = req.body;
//     // console.log(candidateID);
//     const userId = "6633c42c5d4be76438e5a913";


//     try{
//         // Find the Candidate document with the specified candidateID
//         const candidate = await Candidate.findOne({name});
//         console.log("Candidate id ", candidate);
//         if(!candidate){
//             return res.status(404).json({ message: 'Candidate not found' });
//         }

//         const user = await User.findById(userId);
//         if(!user){
//             return res.status(404).json({ message: 'user no+t found' });
//         }
//         if(user.role == 'admin'){
//             return res.status(403).json({ message: 'admin is not allowed'});
//         }
//         if(user.isVoted){
//             return res.status(400).json({ message: 'You have already voted' });
//         }

//         // Update the Candidate document to record the vote
//         candidate.votes.push({user: userId})
//         candidate.voteCount++;  
//         await candidate.save(); 

//         // update the user document
//         user.isVoted = true
//         await user.save();

//         return res.status(200).json({ message: 'Vote recorded successfully' });
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({error: 'Internal Server Error'});
//     }
// });


router.post('/vote/candidates', verifyToken, async (req, res) => {
    const userId = "6633c42c5d4be76438e5a913";
    const { name } = req.body;
    try {
      // Find user by name or create a new user if not found
      const candidate = await Candidate.findOne({ name });
      const user = await User.findById(userId);
      // Increment vote count
      candidate.votes.push({user: userId});
     
      candidate.voteCount++;
      // Save the user
    //   await candidate.save();
    
   await candidate.save();
      res.send('success');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

// vote count 
router.get('/vote/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Get List of all candidates with only name and party fields
router.get('/profile', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        // const candidates = await Candidate.find({}, 'name party -_id');
        const candidates = await Candidate.find();
        // Return the list of candidates
        // res.status(200).json(candidates);
        res.render('candidates', { candidates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) return res.redirect('/user/login');
    next();
  }

module.exports = router;