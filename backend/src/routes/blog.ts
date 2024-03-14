import { Hono } from 'hono'
// import { PrismaClient } from '@prisma/client/edge'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'

import { decode, jwt, sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
    Variables: {
        userId: string;
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("authorization") || " ";
  
    const token = header.split(" ")[1];
    console.log("Value of token is: ", token)
  
    const user = await verify(token, c.env.JWT_SECRET);
  
    if(!user){
      return c.json({msg: "Unauthorized"})
    }
    else{
        console.log("user is authorized")
        c.set("userId", user.id)
        await next()
    }
  
  });

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const userId = c.get("userId")
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    
    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId
        }
    })

    return c.json({id: blog.id})
});


blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    
    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })

    return c.json({id: blog.id})

});

blogRouter.get('/bulk', async (c) =>{
    // just return the list of all the blogs present in the field
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        console.log("Get all the blog posts from")
        const allblogs = await prisma.post.findMany();
        return c.json({allblogs})
    }

    catch(e){
        console.log("Error while getting the blog posts")
        return c.json({msg: "Issues while getting the user"})

    }


});


blogRouter.get('/:id', async (c) => {
    const body = await c.req.json();
    const id = c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const blog = await prisma.post.findFirst({
            where: {
                id: id
            },
        })
    
        return c.json({blog})

    }
    catch(e) {
        c.status(411);
        return c.json({msg: "Error while fetching the blog post"})
    }
});





