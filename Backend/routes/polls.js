
// // import axios from "axios";
// // import express from "express";
// // import authMiddleware from '../middleware/authMiddleware.js';
// // import Poll from "../models/Poll.js";
// // import Vote from "../models/Vote.js";

// // const router = express.Router();


// // // ✅ Create Poll
// // router.post("/", async (req, res) => {
// //     console.log("📦 Poll POST body:", req.body); 
// //   try {
// //     const { title, description, options, createdBy, targetLocation, closeDate } = req.body;
// //     /* new */
// //     /* if (!targetLocation || !targetLocation.trim()) {
// //   return res.status(400).json({ error: "Location is required" });
// // } */
// // /* new */
// //     const poll = new Poll({
// //       title,
// //       description,
// //       options: options.map((opt) => ({ text: opt })),
// //       createdBy,
// //       targetLocation,
// //       closeDate,
// //     });

// //     await poll.save();
// //     res.status(201).json(poll);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   const pollData = {
// //     title: question,
// //     description,
// //     options: options.filter((opt) => opt.trim() !== ""),
// //     targetLocation: "Jamshedpur",   // later dynamic
// //     createdBy: "64fb1234abcd56789ef00123", // userId from login
// //     closeDate,
// //   };

// //   try {
// //     const res = await axios.post("http://localhost:5000/api/polls", pollData);
// //     console.log("✅ Poll saved:", res.data);
// //     alert("Poll created successfully!");
// //   } catch (err) {
// //     console.error("❌ Error creating poll:", err.response?.data || err.message);
// //     alert("Error: " + (err.response?.data?.error || "Failed to create poll"));
// //   }
// // };

// // // ✅ Other routes (same as before)...

// // /* export default router; */


// // // ✅ Get All Polls
// // router.get("/", async (req, res) => {
// //   try {
// //     const polls = await Poll.find();
// //     res.json(polls);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// // router.post("/:id/vote", async (req, res) => {
// //   try {
// //     const { userId, selectedOption } = req.body;
// //     const pollId = req.params.id;

// //     // Find poll
// //     const poll = await Poll.findById(pollId);
// //     if (!poll) return res.status(404).json({ error: "Poll not found" });

// //     // Prevent duplicate voting
// //     const existingVote = await Vote.findOne({ pollId, userId });
// //     if (existingVote) return res.status(400).json({ error: "User already voted on this poll" });

// //     // Save vote
// //     const vote = new Vote({ pollId, userId, selectedOption });
// //     await vote.save();

// //     // Increment vote count
// //     const optionIndex = typeof selectedOption === "number"
// //       ? selectedOption
// //       : poll.options.findIndex((o) => o.text === selectedOption);

// //     if (optionIndex === -1) return res.status(400).json({ error: "Invalid option" });

// //     poll.options[optionIndex].votes += 1;
// //     await poll.save();

// //     res.json({ message: "Vote submitted", poll });
// //   } catch (err) {
// //     if (err.code === 11000) {
// //       return res.status(400).json({ error: "User already voted on this poll" });
// //     }
// //     res.status(500).json({ error: err.message });
// //   }
// // });
// // // Get poll IDs the user has voted on
// // router.get("/voted", async (req, res) => {
// //   const { userId } = req.query;
// //   if (!userId) return res.status(400).json({ error: "userId required" });
// //   const votes = await Vote.find({ userId });
// //   res.json(votes.map(v => v.pollId.toString()));
// // });
// // // ✅ Update Poll
// // router.put("/:id", async (req, res) => {
// //   try {
// //     const { title, description, options, targetLocation, closeDate, status } = req.body;

// //     const poll = await Poll.findById(req.params.id);
// //     if (!poll) return res.status(404).json({ error: "Poll not found" });

// //     // Update fields if provided
// //     if (title) poll.title = title;
// //     if (description) poll.description = description;
// //     if (options && options.length > 0) {
// //       poll.options = options.map((opt) => ({ text: opt, votes: 0 }));
// //     }
// //     if (targetLocation) poll.targetLocation = targetLocation;
// //     if (closeDate) poll.closeDate = closeDate;
// //     if (status) poll.status = status;

// //     await poll.save();
// //     res.json({ message: "Poll updated successfully", poll });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // GET /api/polls/my-polls - Fetches polls created ONLY by the logged-in official
// // router.get('/my-polls', authMiddleware, async (req, res) => {
// //     try {
// //         // This query finds polls where 'createdBy' matches the logged-in user's ID
// //         const officialPolls = await Poll.find({ createdBy: req.user.id })
// //             .sort({ createdAt: -1 });
        
// //         res.json(officialPolls);
// //     } catch (err) {
// //         console.error("Error fetching official's polls:", err);
// //         res.status(500).json({ error: 'Failed to fetch polls' });
// //     }
// // });

// // // ✅ Delete Poll
// // router.delete("/:id", async (req, res) => {
// //   try {
// //     const poll = await Poll.findByIdAndDelete(req.params.id);
// //     if (!poll) return res.status(404).json({ error: "Poll not found" });

// //     res.json({ message: "Poll deleted successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// // // ✅ Get Poll Results
// // router.get("/:id/results", async (req, res) => {
// //   try {
// //     const poll = await Poll.findById(req.params.id);
// //     if (!poll) return res.status(404).json({ error: "Poll not found" });

// //     res.json({
// //       question: poll.title,
// //       options: poll.options.map((o) => ({
// //         text: o.text,
// //         votes: o.votes,
// //       })),
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
  
// // });

// // /* 
// // module.exports = router; */
// // export default router;








// import express from "express";
// import mongoose from "mongoose"; // 1. Import Mongoose
// import Poll from "../models/Poll.js";
// import Vote from "../models/Vote.js";

// const router = express.Router();

// // ✅ Create a new Poll
// router.post("/", async (req, res) => {
//   try {
//     const { title, description, options, createdBy, targetLocation, closeDate } = req.body;

//     // 2. ADDED THIS VALIDATION BLOCK
//     if (!mongoose.Types.ObjectId.isValid(createdBy)) {
//         return res.status(400).json({ error: "Invalid creator ID provided." });
//     }

//     if (!title || !options || options.length < 2) {
//         return res.status(400).json({ error: "Title and at least two options are required." });
//     }

//     const poll = new Poll({
//       title,
//       description,
//       options: options.map((opt) => ({ text: opt, votes: 0 })),
//       createdBy,
//       targetLocation,
//       closeDate,
//     });

//     await poll.save();
//     res.status(201).json(poll);
//   } catch (err) {
//     console.error("Error creating poll:", err);
//     res.status(500).json({ error: "Failed to create poll due to a server error." });
//   }
// });


// // (The rest of your polls.js file remains the same)

// // ✅ Get All Polls
// router.get("/", async (req, res) => {
//   try {
//     const polls = await Poll.find().sort({ createdAt: -1 }).populate("createdBy", "fullName role _id");
//     res.json(polls);
//   } catch (err) {
//     console.error("Error fetching polls:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Get Poll IDs that a specific user has voted on
// router.get("/voted", async (req, res) => {
//   const { userId } = req.query;

//   if (!userId || userId === "undefined" || userId === "null") {
//     return res.status(400).json({ error: "A valid userId query parameter is required." });
//   }

//   try {
//     const votes = await Vote.find({ userId }).select('pollId');
//     res.json(votes.map(v => v.pollId.toString()));
//   } catch (err) {
//     console.error("Error fetching voted polls:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Vote on a Poll
// router.post("/:id/vote", async (req, res) => {
//   try {
//     const { userId, selectedOption } = req.body;
//     const pollId = req.params.id;

//     if (!userId || selectedOption === undefined) {
//         return res.status(400).json({ error: "userId and selectedOption are required." });
//     }

//     const poll = await Poll.findById(pollId);
//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found." });
//     }

//     const existingVote = await Vote.findOne({ pollId, userId });
//     if (existingVote) {
//       return res.status(400).json({ error: "You have already voted on this poll." });
//     }

//     const vote = new Vote({ pollId, userId, selectedOption });
//     await vote.save();

//     const optionIndex = typeof selectedOption === "number"
//       ? selectedOption
//       : poll.options.findIndex((o) => o.text === selectedOption);

//     if (optionIndex < 0 || optionIndex >= poll.options.length) {
//       return res.status(400).json({ error: "Invalid option selected." });
//     }
    
//     poll.options[optionIndex].votes += 1;
//     await poll.save();

//     res.json({ message: "Vote submitted successfully.", poll });
//   } catch (err) {
//     console.error("Error submitting vote:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Update a Poll
// router.put("/:id", async (req, res) => {
//   try {
//     const { title, description, options, targetLocation, closeDate, status } = req.body;
//     const poll = await Poll.findById(req.params.id);

//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found." });
//     }

//     if (title) poll.title = title;
//     if (description) poll.description = description;
//     if (options && options.length > 0) {
//       poll.options = options.map((opt) => ({ text: opt, votes: 0 }));
//       await Vote.deleteMany({ pollId: req.params.id });
//     }
//     if (targetLocation) poll.targetLocation = targetLocation;
//     if (closeDate) poll.closeDate = closeDate;
//     if (status) poll.status = status;

//     const updatedPoll = await poll.save();
//     res.json({ message: "Poll updated successfully.", poll: updatedPoll });
//   } catch (err) {
//     console.error("Error updating poll:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Delete a Poll
// router.delete("/:id", async (req, res) => {
//   try {
//     const poll = await Poll.findByIdAndDelete(req.params.id);
//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found." });
//     }
//     await Vote.deleteMany({ pollId: req.params.id });
//     res.json({ message: "Poll deleted successfully." });
//   } catch (err) {
//     console.error("Error deleting poll:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Get Poll Results
// router.get("/:id/results", async (req, res) => {
//   try {
//     const poll = await Poll.findById(req.params.id);
//     if (!poll) {
//       return res.status(404).json({ error: "Poll not found." });
//     }
//     res.json({
//       question: poll.title,
//       options: poll.options.map((o) => ({
//         text: o.text,
//         votes: o.votes,
//       })),
//     });
//   } catch (err) {
//     console.error("Error fetching poll results:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;



import axios from "axios";
import express from "express";
import authMiddleware from '../middleware/authMiddleware.js';
import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";

const router = express.Router();


// ✅ Create Poll
router.post("/", async (req, res) => {
    console.log("📦 Poll POST body:", req.body); 
  try {
    const { title, description, options, createdBy, targetLocation, closeDate } = req.body;
    /* new */
    /* if (!targetLocation || !targetLocation.trim()) {
  return res.status(400).json({ error: "Location is required" });
} */
/* new */
    const poll = new Poll({
      title,
      description,
      options: options.map((opt) => ({ text: opt })),
      createdBy,
      targetLocation,
      closeDate,
      /* new buddy 6 */
      isOfficial: req.body.isOfficial === true,
      /* new buddy 6 */
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ...

const handleSubmit = async (e) => {
  e.preventDefault();

  const pollData = {
    title: question,
    description,
    options: options.filter((opt) => opt.trim() !== ""),
    targetLocation: "Jamshedpur",   // later dynamic
    createdBy: "64fb1234abcd56789ef00123", // userId from login
    closeDate,
    
  };

  try {
    const res = await axios.post("http://localhost:5000/api/polls", pollData);
    console.log("✅ Poll saved:", res.data);
    alert("Poll created successfully!");
  } catch (err) {
    console.error("❌ Error creating poll:", err.response?.data || err.message);
    alert("Error: " + (err.response?.data?.error || "Failed to create poll"));
  }
};

// ✅ Other routes (same as before)...

/* export default router; */


// ✅ Get All Polls
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:id/vote", async (req, res) => {
  try {
    const { userId, selectedOption } = req.body;
    const pollId = req.params.id;

    // Find poll
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Prevent duplicate voting
    const existingVote = await Vote.findOne({ pollId, userId });
    if (existingVote) return res.status(400).json({ error: "User already voted on this poll" });

    // Save vote
    const vote = new Vote({ pollId, userId, selectedOption });
    await vote.save();

    // Increment vote count
    const optionIndex = typeof selectedOption === "number"
      ? selectedOption
      : poll.options.findIndex((o) => o.text === selectedOption);

    if (optionIndex === -1) return res.status(400).json({ error: "Invalid option" });

    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json({ message: "Vote submitted", poll });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "User already voted on this poll" });
    }
    res.status(500).json({ error: err.message });
  }
});
// Get poll IDs the user has voted on
router.get("/voted", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const votes = await Vote.find({ userId });
  res.json(votes.map(v => v.pollId.toString()));
});
// ✅ Update Poll
router.put("/:id", async (req, res) => {
  try {
    const { title, description, options, targetLocation, closeDate, status } = req.body;

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Update fields if provided
    if (title) poll.title = title;
    if (description) poll.description = description;
    if (options && options.length > 0) {
      poll.options = options.map((opt) => ({ text: opt, votes: 0 }));
    }
    if (targetLocation) poll.targetLocation = targetLocation;
    if (closeDate) poll.closeDate = closeDate;
    if (status) poll.status = status;

    await poll.save();
    res.json({ message: "Poll updated successfully", poll });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/polls/my-polls - Fetches polls created ONLY by the logged-in official
router.get('/my-polls', authMiddleware, async (req, res) => {
    try {
        // This query finds polls where 'createdBy' matches the logged-in user's ID
        const officialPolls = await Poll.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });
        
        res.json(officialPolls);
    } catch (err) {
        console.error("Error fetching official's polls:", err);
        res.status(500).json({ error: 'Failed to fetch polls' });
    }
});

// ✅ Delete Poll
router.delete("/:id", async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    res.json({ message: "Poll deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get Poll Results
router.get("/:id/results", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    res.json({
      question: poll.title,
      options: poll.options.map((o) => ({
        text: o.text,
        votes: o.votes,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
});

/* 
module.exports = router; */
export default router;