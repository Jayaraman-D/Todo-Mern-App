// todoController.js

import User from "../models/userModel.js";
import bcrypt from 'bcrypt'

export const editProfile = async (req, res) => {
    try {

        let { email, name, oldpassword, newpassword } = req.body;

        const userId = req.user._id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegExp.test(email)) {
            return res.status(400).json({ error: "Invalid email" })
        }

        if (oldpassword || newpassword) {
            if (!oldpassword) {
                return res.status(400).json({ error: "Old password is required to change" })
            }
            if (!newpassword) {
                return res.status(400).json({ error: "New password is required to change" })
            }
            if (newpassword.length < 6) {
                return res.status(400).json({ error: 'New password must have minimum 6 characters' })
            }

            const passwordChecking = await bcrypt.compare(oldpassword, user.password);
            if (!passwordChecking) {
                return res.status(400).json({ error: 'Current password does not match' })
            }

            user.password = await bcrypt.hash(newpassword, 10)
        }


        user.email = email || user.email;
        user.name = name || user.name;

        await user.save();
        res.status(200).json({ message: "Successfully update your profile" })



    } catch (error) {
        console.log(`Error occured in edit profile controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const addTask = async (req, res) => {
    try {

        const { taskname, taskdetails } = req.body;

        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "user not found" })
        }

        if (!taskname) {
            return res.status(400).json({ error: "Taskname is required" })
        }

        const task = {
            taskname: taskname,
            taskdetails: taskdetails
        }

        user.tasks.push(task)
        await user.save()
        res.status(201).json({ message: "New Task is successfully added" })

    } catch (error) {
        console.log(`Error occured in add task controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getallTask = async (req, res) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const allTask = user.tasks;
        res.status(200).json(allTask)

    } catch (error) {
        console.log(`Error occured in get all task controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        user.tasks = user.tasks.filter(task => task._id.toString() !== id);
        await user.save()
        res.status(200).json({ message: "Successfully deleted the task" })
    } catch (error) {
        console.log(`Error occured in delete task controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const completedTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const task = user.tasks.find((task) => task._id.toString() === id.toString());

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        task.completed = true;
        await user.save();

        res.status(200).json({ message: "Congratulation!.. You have successfully completed the task" });


    } catch (error) {
        console.log(`Error occured in completed task controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getTask = async (req, res) => {
    try {

        const userId = req.user._id;
        const { id } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: " User not found" })
        }

        const task = user.tasks.find((task) => task._id.toString() === id.toString());

        if (!task) {
            return res.status(404).json({ error: "Task not found" })
        }

        res.status(200).json(task);

    } catch (error) {
        console.log(`Error occured in get task controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { taskname, taskdetails } = req.body
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const task = user.tasks.find((task) => task._id.toString() === id.toString());
        if (!task) {
            return res.status(404).json({ error: "Task not found" })
        }
        task.taskname = taskname || task.taskname
        task.taskdetails = taskdetails || task.taskdetails

        await user.save();

        res.status(200).json({ message: "Successfully updated the task" })

    } catch (error) {
        console.log(`Error occured in edit task controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
}