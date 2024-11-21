"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAiModel"; // Ensure this is client-compatible
import { LoaderCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of jobExperience: ${jobExperience}. Provide ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format.`;

            // Generate JSON response from chatSession
            const result = await chatSession.sendMessage(InputPrompt);
            const MockJsonResp = (await result.response.text())
                .replace(/```json/g, "")
                .replace(/```/g, " ");
            const parsedResponse = JSON.parse(MockJsonResp);

            // Send data to the server
            const response = await fetch("/api/add-interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobPosition,
                    jobDesc,
                    jobExperience,
                    jsonResponse: parsedResponse,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save interview details.");
            }

            const responseData = await response.json();
            console.log("Inserted ID:", responseData.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDialog(true)}
            >
                <h2 className="text-lg">+ Add New</h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your job interviewing
                        </DialogTitle>
                        <div>
                            <h2 className="text-muted-foreground">
                                Add details about your job position/role, job description, and years of experience.
                            </h2>
                        </div>
                    </DialogHeader>
                    <form onSubmit={onSubmit}>
                        <div className="mt-7 my-3">
                            <label>Job Role/Job Position</label>
                            <Input
                                placeholder="Ex. Full Stack Developer"
                                required
                                onChange={(event) => setJobPosition(event.target.value)}
                            />
                        </div>
                        <div className="my-3">
                            <label>Job Description/Tech Stack</label>
                            <Textarea
                                placeholder="Ex. React, Angular, Node.js, MySQL, etc."
                                required
                                onChange={(event) => setJobDesc(event.target.value)}
                            />
                        </div>
                        <div className="mt-7 my-2">
                            <label>Years of Experience</label>
                            <Input
                                placeholder="Ex. 5"
                                max="50"
                                type="number"
                                required
                                onChange={(event) => setJobExperience(event.target.value)}
                            />
                        </div>
                        <div className="flex gap-5 justify-end">
                            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <LoaderCircle className="animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
