import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../db';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    res.json({
      id: user.id,
      clerkUserId: user.clerkUserId,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || undefined,
      profileCompleted: user.profileCompleted,
      addresses: user.addresses,
      paymentMethods: [
        {
          id: 'pay-1',
          type: 'upi',
          title: 'Google Pay (UPI)',
          details: 'Instant Confirmation',
          isDefault: true,
        },
        {
          id: 'pay-2',
          type: 'card',
          title: 'Visa / Mastercard',
          details: '•••• 4242',
          isDefault: false,
        },
      ],
      hasProtectionPlan: true,
      protectionPlanExpiry: '31 Dec 2026',
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, phone, profileCompleted, avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(profileCompleted !== undefined && { profileCompleted: Boolean(profileCompleted) }),
        ...(avatarUrl && { avatarUrl }),
      },
      include: {
        addresses: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getAddresses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(addresses);
  } catch (error) {
    console.error('getAddresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

export const createAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, type, street, city, state, zipCode, country, isDefault } = req.body;

    if (!street || !city || !state) {
      res.status(422).json({ error: 'Street, city, and state are required fields' });
      return;
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        title: title || 'Home',
        type: type || 'home',
        street,
        city,
        state,
        zipCode: zipCode || '560102',
        country: country || 'India',
        isDefault: Boolean(isDefault),
      },
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('createAddress error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
};

export const updateAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existing = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Address not found or unauthorized' });
      return;
    }

    const { title, type, street, city, state, zipCode, country, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(street && { street }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(country && { country }),
        ...(isDefault !== undefined && { isDefault: Boolean(isDefault) }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('updateAddress error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

export const deleteAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existing = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Address not found or unauthorized' });
      return;
    }

    await prisma.address.delete({
      where: { id },
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('deleteAddress error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};
