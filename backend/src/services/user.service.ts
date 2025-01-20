import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface CreateUserInput {
    email: string;
    password: string;
    name: string;
}

export const createUser = async ({
    email,
    password,
    name,
}: CreateUserInput) => {
    if (!email || !password || !name) {
        throw new Error("All fields are required");
    }
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name,
            },
        });
        return user;
    } catch (error) {
        console.error("Error creating the user", error);
    }
};
