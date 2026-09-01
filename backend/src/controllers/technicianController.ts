import { Request, Response } from 'express';
import prisma from '../db';
import { broadcastToUser } from '../socket';

export const updateTechnicianLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { technicianId, currentLat, currentLng } = req.body;

    if (!technicianId || currentLat === undefined || currentLng === undefined) {
      res.status(422).json({ error: 'technicianId, currentLat, and currentLng are required' });
      return;
    }

    const updatedTech = await prisma.technician.update({
      where: { id: technicianId },
      data: {
        currentLat: Number(currentLat),
        currentLng: Number(currentLng),
      },
    });

    // Find active bookings assigned to this technician
    const activeBookings = await prisma.booking.findMany({
      where: {
        technicianId,
        bookingStatus: { in: ['scheduled', 'technician_assigned', 'in_progress'] },
      },
    });

    for (const booking of activeBookings) {
      broadcastToUser(booking.userId, 'technician:location_updated', {
        bookingId: booking.id,
        technicianId: updatedTech.id,
        currentLat: updatedTech.currentLat,
        currentLng: updatedTech.currentLng,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      message: 'Technician location updated successfully',
      technician: updatedTech,
      notifiedBookingsCount: activeBookings.length,
    });
  } catch (error) {
    console.error('updateTechnicianLocation error:', error);
    res.status(500).json({ error: 'Failed to update technician location' });
  }
};
