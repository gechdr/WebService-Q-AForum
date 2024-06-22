const express = require("express");
const Joi = require("joi").extend(require("@joi/date"));

const app = express();
app.set("port", 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t4_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const User = require("./models/User");
const Thread = require("./models/Thread");
const Reply = require("./models/Reply");

// Functions

async function checkUniqueUsername(username) {
	let tempUser = await User.findAll({
		where: {
			username: username,
		},
	});

	if (tempUser.length > 0) {
		throw new Error("Username has already been taken");
	}
}

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }

  if (age < 17) {
    throw new Error("You must be at least 17 yeard old in order to register");
  }
}

async function generateUserID(){
  // Find Last ID

  let tempID = "U";

	let users = await User.findAll({
		where: {
			user_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (users.length > 0) {
		users.forEach((user) => {
			let user_id = user.user_id;
			lastID = user_id.substring(1,4);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

async function checkUserExist(user_id){

  let user = await User.findByPk(user_id);
  if (!user) {
    throw new Error("User not found")
  }
}

async function checkPostExist(post_id){

	let temp = post_id.substring(0,1);

	if (temp === "T") {
		// Thread
		let thread = await Thread.findByPk(post_id);
		if (!thread) {
			throw new Error("Post not found");
		}
	} else if (temp === "R") {
		// Reply
		let reply = await Reply.findByPk(post_id);
		if (!reply) {
			throw new Error("Post not found");
		}
	}
}

function getTimeNow(){
  let today = new Date();

  let year = today.getFullYear().toString().padStart(4, "0");
  let month = (today.getMonth() + 1).toString().padStart(2, "0");
  let day = today.getDate().toString().padStart(2, "0");
  let date = year + '-' + month + '-' + day;

  let hour = today.getHours().toString().padStart(2, "0");
  let minute = today.getMinutes().toString().padStart(2, "0");
  let second = today.getSeconds().toString().padStart(2, "0");
  let time = hour + ":" + minute + ":" + second;
  var dateTime = date + ' ' + time;

  return dateTime;
}

async function generateThreadID(){
  // Find Last ID

  let tempID = "T";

	let threads = await Thread.findAll({
		where: {
			thread_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (threads.length > 0) {
		threads.forEach((thread) => {
			let thread_id = thread.thread_id;
			lastID = thread_id.substring(1,4);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

async function generateReplyID(){
	// Find Last ID

  let tempID = "R";

	let replies = await Reply.findAll({
		where: {
			reply_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (replies.length > 0) {
		replies.forEach((reply) => {
			let reply_id = reply.reply_id;
			lastID = reply_id.substring(1,4);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

async function updateThread(thread_id,viewers){
	try {
		thread = await Thread.update(
			{
				viewers: viewers
			},
			{
				where: {
					thread_id: thread_id
				}
			}
		);
	} catch (error) {
		return res.status(400).send({
			message: "Update Failed",
			error,
		});
	}
}

async function checkAuthorize(post_id,user_id){

	let temp = post_id.substring(0,1);

	if (temp === "T") {
		// Thread
		let threads = await Thread.findAll({
			where: {
				[Op.and]: {
					user_id: user_id,
					thread_id: post_id
				}
			}
		})

		if (threads.length < 1) {
			return false
		}

	} else if (temp === "R") {
		// Reply
		let replies = await Reply.findAll({
			where: {
				[Op.and]: {
					user_id: user_id,
					reply_id: post_id
				}
			}
		})

		if (replies.length < 1) {
			return false
		}
	}
}

// Points
// 1
app.post("/api/users", async (req, res) => {
	let { username, display_name, email, dob, phone_number } = req.body;

	const schema = Joi.object({
		username: Joi.string().external(checkUniqueUsername).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    }),
		display_name: Joi.string().required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    }),
		email: Joi.string().email().required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field",
      "string.email": "Invalid email address"
    }),
		dob: Joi.date().format("YYYY-MM-DD").external(getAge).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    }),
		phone_number: Joi.string().min(8).max(12).pattern(/^[0-9]+$/).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field",
      "string.min": "Invalid phone number",
      "string.max": "Invalid phone number",
      "string.pattern.base" : "Invalid phone number"
    }),
	});

	try {
		await schema.validateAsync(req.body);
	} catch (error) {
		return res.status(400).send(error.toString());
	}

  // Generate ID
  let newID = await generateUserID();

  // Insert
  try {
		user = await User.create({
			user_id: newID,
			username: username,
			display_name: display_name,
			email: email,
			dob: dob,
      phone_number: phone_number,
      bio: ""
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
    user_id: newID,
    display_name: display_name,
    username: username,
    email: email,
    bio: ""
  });
});

// 2
app.post("/api/threads", async (req,res) => {

  let {user_id,title,content} = req.body;

  const schema = Joi.object({
		user_id: Joi.string().external(checkUserExist).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    }),
		title: Joi.string().max(64).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Your title must not exceed 64 characters and not an empty input",
			"string.max": "Your title must not exceed 64 characters and not an empty input"
    }),
		content: Joi.string().max(250).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Your content must not exceed 250 characters and not an empty input",
			"string.max": "Your content must not exceed 250 characters and not an empty input"
    })
	});

	try {
		await schema.validateAsync(req.body);
	} catch (error) {
    if (error.toString() === "Error: User not found (user_id)") {
      return res.status(404).send(error.toString());
    }
		return res.status(400).send(error.toString());
	}

  // Generate ID
  let newID = await generateThreadID();

  // Time Now
  let now = getTimeNow();

  // Insert
  try {
		thread = await Thread.create({
			thread_id: newID,
			user_id: user_id,
			title: title,
			content: content,
			viewers: [],
      created_at: now
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

  return res.status(201).send({
    post_id: newID,
    user_id: user_id,
    title: title,
    content: content,
    replies: [],
    created_at: now,
    updated_at: null
  })
})

// 3
app.post("/api/replies", async (req,res) => {

	let {user_id,post_id, content} = req.body;

	const schema = Joi.object({
		user_id: Joi.string().external(checkUserExist).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    }),
		post_id: Joi.string().external(checkPostExist).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    }),
		content: Joi.string().max(250).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Your content must not exceed 250 characters and not an empty input",
			"string.max": "Your content must not exceed 250 characters and not an empty input"
    })
	});

	try {
		await schema.validateAsync(req.body);
	} catch (error) {
    if (error.toString() === "Error: User not found (user_id)" || error.toString() === "Error: Post not found (post_id)") {
      return res.status(404).send(error.toString());
    }
		return res.status(400).send(error.toString());
	}

	// Generate ID
  let newID = await generateReplyID();

  // Time Now
  let now = getTimeNow();

	console.log(newID);
	console.log(now);

  // Insert
  try {
		reply = await Reply.create({
			reply_id: newID,
			post_id: post_id,
			user_id: user_id,
			content: content,
      created_at: now
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

  return res.status(201).send({
    reply_id: newID,
		user_id: user_id,
		content: content,
		replies: [],
		created_at: now,
		updated_at: null
  })
})

// 4
app.get("/api/users/:user_id?", async (req,res) => {
	let {user_id} = req.params;
	let {username} = req.query;

	const schema = Joi.object({
		user_id: Joi.string().optional().external(checkUserExist).messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    })
	});

	if (user_id) {
		// Params
		try {
			await schema.validateAsync(req.params);
		} catch (error) {
			return res.status(404).send(error.toString());
		}

		let user = await User.findByPk(user_id);
		let threads = await Thread.findAll({
			where: {
				user_id: user_id
			},
			attributes: ["thread_id","title"]
		});
		let replies = await Reply.findAll({
			where: {
				user_id: user_id
			},
			attributes: [
				"reply_id",
				[Sequelize.col("post_id"), "thread_id"],
				"content"]
		})

		return res.status(200).send({
			username: user.username,
			display: user.display_name,
			bio: user.bio,
			threads_count: threads.length,
			replies_count: replies.length,
			threads,
			replies
		})

	} else {
		// Query
		let users = await User.findAll({
			where: {
				username: {
					[Op.like]: "%" + username + "%"
				}
			},
			attributes: ["user_id","username","display_name"]
		})

		return res.status(200).send({
			total: users.length,
			users: users
		});
	}
})

// 5
app.get("/api/posts/:post_id?", async (req,res) => {
	let {post_id} = req.params;
	let {keyword} = req.query;

	const schema = Joi.object({
		post_id: Joi.string().optional().external(checkPostExist).messages({
      "any.required": "Invalid data field",
      "string.empty": "Invalid data field"
    })
	});

	if (post_id) {
		// Params
		try {
			await schema.validateAsync(req.params);
		} catch (error) {
			return res.status(404).send(error.toString());
		}

		let post;
		let thread = await Thread.findByPk(post_id);
		let reply = await Reply.findByPk(post_id);
		if (thread) {
			post = thread;
		} else {
			post = reply;
		}

		let user;
		let replies = [];
		let newReplies = [];

		if (thread) {
			// Thread
			user = await User.findByPk(thread.user_id);
			replies = await Reply.findAll({
				where: {
					post_id: post_id
				}
			})
			
			for (let i = 0; i < replies.length; i++) {
				const reply = replies[i];
				let count = await Reply.count({
					where: {
						post_id: reply.reply_id
					}
				})
				newReplies.push({
					reply_id: reply.reply_id,
					user_id: reply.user_id,
					content: reply.content,
					replies: count
				})
			}
		} else {
			// Reply
			user = await User.findByPk(reply.user_id);
			replies = await Reply.findAll({
				where: {
					post_id: post_id
				}
			})
			
			for (let i = 0; i < replies.length; i++) {
				const reply = replies[i];
				let count = await Reply.count({
					where: {
						post_id: reply.reply_id
					}
				})
				newReplies.push({
					reply_id: reply.reply_id,
					user_id: reply.user_id,
					content: reply.content,
					replies: count
				})
			}
		}

		return res.status(200).send({
			author_username: user.username,
			author_display_name: user.display_name,
			title: post.title,
			content: post.content,
			created_at: post.created_at,
			updated_at: post.updated_at,
			replies_count: replies.length,
			replies: newReplies
		});
	} else {
		// Query
		let threads = await Thread.findAll({
			where: {
				[Op.or]: {
					title: {
						[Op.like]: "%" + keyword + "%"
					},
					content: {
						[Op.like]: "%" + keyword + "%"
					}

				}
			},
			attributes: [
				[Sequelize.col("thread_id"), "post_id"],
				"user_id",
				"title",
				"content"
			]
		})
		let replies = await Reply.findAll({
			where: {
				content: {
					[Op.like]: "%" + keyword + "%"
				}
			},
			attributes: [
				[Sequelize.col("reply_id"), "post_id"],
				"user_id",
				"title",
				"content"
			]
		})

		let posts = [...threads, ...replies];

		return res.status(200).send({
			total: posts.length,
			posts
		});
	}
})

// 6
app.put("/api/users/:user_id", async (req,res) => {
	let {user_id} = req.params;
	let {display_name,bio,email} = req.body;

	const schema = Joi.object({
		user_id: Joi.string().external(checkUserExist).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Empty input field!"
    }),
		display_name: Joi.string().optional().messages({
      "any.required": "Invalid data field",
      "string.empty": "Empty input field!"
    }),
		email: Joi.string().email().optional().messages({
      "any.required": "Invalid data field",
      "string.empty": "Empty input field!",
      "string.email": "Invalid email address"
    }),
		bio: Joi.string().max(128).optional().messages({
			"any.required": "Invalid data field",
      "string.empty": "Empty input field!",
			"string.max": "Your bio must not exceed 128 characters"
		})
	});

	try {
		await schema.validateAsync({
			user_id: user_id,
			display_name: display_name,
			bio: bio,
			email: email
		});
	} catch (error) {
		if (error.toString() === "Error: User not found (user_id)") {
			return res.status(404).send(error.toString());
		}
		return res.status(400).send(error.toString());
	}

	// Update
	if (display_name) {
		try {
			users = await User.update(
				{
					display_name: display_name
				},
				{
					where: {
						user_id: user_id
					}
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}
	}
	if (bio) {
		try {
			users = await User.update(
				{
					bio: bio
				},
				{
					where: {
						user_id: user_id
					}
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}
	}
	if (email) {
		try {
			users = await User.update(
				{
					email: email
				},
				{
					where: {
						user_id: user_id
					}
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}
	}

	// Get Updated Data
	let user = await User.findByPk(user_id);
	display_name = user.display_name;
	bio = user.bio;
	email = user.email;

	return res.status(200).send({
		user_id: user_id,
		display_name: display_name,
		bio: bio,
		email: email	
	});
})

// 7
app.get("/api/home", async (req,res) => {
	let {user_id} = req.query;

	const schema = Joi.object({
		user_id: Joi.string().external(checkUserExist).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Empty input field!"
    })
	});

	try {
		await schema.validateAsync(req.query);
	} catch (error) {
		if (error.toString() === "Error: User not found (user_id)") {
			return res.status(404).send(error.toString());
		}
		return res.status(400).send(error.toString());
	}

	let threads = await Thread.findAll({
		limit: 10,
		order: [
			["thread_id","DESC"]
		]
	})

	let result = [];
	for (let i = 0; i < threads.length; i++) {
		const thread = threads[i];
		let thread_id = thread.thread_id;
		let tempUser_id = thread.user_id;
		let title = thread.title;

		let replies = await Reply.count({
			where: {
				post_id: thread.thread_id
			}
		})

		let viewers = JSON.parse(thread.viewers);
		
		let status = "NEW";
		for (let i = 0; i < viewers.length; i++) {
			const viewer = viewers[i];

			if (viewer === user_id) {
				status = "READ";
			}
		}

		if (status === "NEW") {
			// Update Viewers
			viewers.push(user_id);
			await updateThread(thread_id,viewers);
		}

		result.push({
			thread_id: thread_id,
			user_id: tempUser_id,
			title: title,
			replies: replies,
			status: status
		})
	}

	return res.status(200).send({
		threads: result
	});
})

// 8
app.put("/api/posts/:post_id", async (req,res) => {
	let {post_id} = req.params;
	let {user_id,new_content} = req.body;

	const schema = Joi.object({
		post_id: Joi.string().external(checkPostExist).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Empty input field!"
    }),
		user_id: Joi.string().external(checkUserExist).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Empty input field!"
    }),
		new_content: Joi.string().max(250).required().messages({
      "any.required": "Invalid data field",
      "string.empty": "Empty input field!",
			"string.max": "Your content must not exceed 250 characters"
    })
	});

	try {
		await schema.validateAsync({
			post_id: post_id,
			user_id: user_id,
			new_content: new_content
		});
	} catch (error) {
		if (error.toString() === "Error: Post not found (post_id)" || error.toString() === "Error: User not found (user_id)") {
			return res.status(404).send(error.toString());
		}
		return res.status(400).send(error.toString());
	}

	let authorize = await checkAuthorize(post_id,user_id);
	if (authorize === false) {
		return res.status(400).send("Error: Unauthorized editing access");
	}

	// Update
	let temp = post_id.substring(0,1);
	let now = getTimeNow();
	let post;
	if (temp === "T") {
		// Thread
		try {
			threads = await Thread.update(
				{
					content: new_content,
					updated_at: now
				},
				{
					where: {
						thread_id: post_id
					}
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}
		post = await Thread.findByPk(post_id);
	} else if (temp === "R") {
		// Reply
		try {
			replies = await Reply.update(
				{
					content: new_content,
					updated_at: now
				},
				{
					where: {
						reply_id: post_id
					}
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}
		post = await Reply.findByPk(post_id);
	}

	let replies = await Reply.findAll({
		where: {
			post_id: post_id
		},
		attributes: ["reply_id","user_id","content"]
	})

	return res.status(200).send({
		post_id: post_id,
		user_id: user_id,
		title: post.title,
		content: post.content,
		replies: replies,
		created_at: post.created_at,
		updated_at: post.updated_at
	})
});

app.listen(app.get("port"), () => {
	console.log(`Server started at http://localhost:${app.get("port")}`);
});
