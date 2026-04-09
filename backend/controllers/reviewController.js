import prisma from '../prisma/client.js';

const REACTIONS = {
    LIKE: '👍',
    LOVE: '❤️',
    WOW: '😮',
    FUNNY: '😂',
    SAD: '😢'
};

// Get all reactions and comments for an event
export const getEventReviews = async (req, res) => {
    try {
        const { eventId } = req.params;

        const reviews = await prisma.eventReview.findMany({
            where: { eventId: parseInt(eventId) },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        department: true,
                        year: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate reaction counts
        const reactionCounts = {
            LIKE: 0,
            LOVE: 0,
            WOW: 0,
            FUNNY: 0,
            SAD: 0
        };

        let totalReactionCount = 0;
        reviews.forEach(r => {
            if (r.reaction) {
                reactionCounts[r.reaction]++;
                totalReactionCount++;
            }
        });

        res.json({
            success: true,
            data: {
                reviews,
                totalReactions: totalReactionCount,
                reactionCounts,
                reactionEmojis: REACTIONS
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add or update a reaction for an event
export const addEventReview = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { reaction, comment } = req.body;
        
        console.log('addEventReview - req.user:', req.user);
        console.log('addEventReview - eventId:', eventId);
        console.log('addEventReview - body:', { reaction, comment });
        
        // Get studentId from various possible locations in the token
        const studentId = req.user?.id || req.user?.studentId || req.user?.userId;

        if (!studentId) {
            console.error('studentId not found in req.user:', req.user);
            return res.status(400).json({
                success: false,
                message: 'Student ID not found in token',
                debug: { receivedUser: req.user }
            });
        }

        console.log('Student ID extracted:', studentId);

        // Validate reaction
        const validReactions = ['LIKE', 'LOVE', 'WOW', 'FUNNY', 'SAD'];
        if (reaction && !validReactions.includes(reaction)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reaction type'
            });
        }

        // Validate comment
        if (comment && comment.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Comment must be less than 1000 characters'
            });
        }

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if student already has a reaction/comment on this event
        const existingReview = await prisma.eventReview.findUnique({
            where: {
                studentId_eventId: {
                    studentId,
                    eventId: parseInt(eventId)
                }
            }
        });

        let newReview;

        if (existingReview) {
            console.log('Updating existing review:', existingReview.id);
            // Update existing reaction/comment
            newReview = await prisma.eventReview.update({
                where: { id: existingReview.id },
                data: {
                    reaction: reaction || null,
                    comment: comment || null
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                            department: true,
                            year: true
                        }
                    }
                }
            });
        } else {
            console.log('Creating new review for student:', studentId, 'event:', eventId);
            // Create new reaction/comment
            newReview = await prisma.eventReview.create({
                data: {
                    eventId: parseInt(eventId),
                    studentId,
                    reaction: reaction || null,
                    comment: comment || null
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                            department: true,
                            year: true
                        }
                    }
                }
            });
        }

        console.log('Review saved successfully:', newReview.id);

        res.status(201).json({
            success: true,
            message: existingReview ? 'Reaction updated successfully' : 'Reaction added successfully',
            data: newReview
        });
    } catch (error) {
        console.error('Error in addEventReview:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Update a reaction/comment
export const updateEventReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reaction, comment } = req.body;
        
        // Consistent studentId extraction
        const studentId = req.user?.id || req.user?.studentId || req.user?.userId;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID not found in token'
            });
        }

        // Find the review
        const existingReview = await prisma.eventReview.findUnique({
            where: { id: parseInt(reviewId) }
        });

        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: 'Reaction not found'
            });
        }

        // Check ownership
        if (existingReview.studentId !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own reactions'
            });
        }

        // Validate reaction
        const validReactions = ['LIKE', 'LOVE', 'WOW', 'FUNNY', 'SAD'];
        if (reaction && !validReactions.includes(reaction)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reaction type'
            });
        }

        // Update reaction/comment
        const updatedReview = await prisma.eventReview.update({
            where: { id: parseInt(reviewId) },
            data: {
                reaction: reaction || null,
                comment: comment || null
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        department: true,
                        year: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Reaction updated successfully',
            data: updatedReview
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a reaction
export const deleteEventReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        // Consistent studentId extraction
        const studentId = req.user?.id || req.user?.studentId || req.user?.userId;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID not found in token'
            });
        }

        // Find the review
        const review = await prisma.eventReview.findUnique({
            where: { id: parseInt(reviewId) }
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Reaction not found'
            });
        }

        // Check ownership
        if (review.studentId !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own reactions'
            });
        }

        // Delete reaction
        await prisma.eventReview.delete({
            where: { id: parseInt(reviewId) }
        });

        res.json({
            success: true,
            message: 'Reaction deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get student's reaction for an event
export const getStudentReview = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        // Consistent studentId extraction
        const studentId = req.user?.id || req.user?.studentId || req.user?.userId;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID not found in token'
            });
        }

        const review = await prisma.eventReview.findUnique({
            where: {
                studentId_eventId: {
                    studentId,
                    eventId: parseInt(eventId)
                }
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        department: true,
                        year: true
                    }
                }
            }
        });

        if (!review) {
            return res.json({
                success: true,
                data: null
            });
        }

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
