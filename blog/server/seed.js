import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bloghaven.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Platform administrator managing BlogHaven',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      isActive: true,
      isVerified: true,
    });

    const author1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@bloghaven.com',
      password: 'author123',
      role: 'author',
      bio: 'Tech writer passionate about web development and AI. Sharing tutorials and insights.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      isActive: true,
      isVerified: true,
    });

    const author2 = await User.create({
      name: 'Michael Chen',
      email: 'michael@bloghaven.com',
      password: 'author123',
      role: 'author',
      bio: 'Full-stack developer and coffee enthusiast. Writing about React, Node.js, and best practices.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
      isActive: true,
      isVerified: true,
    });

    const author3 = await User.create({
      name: 'Emma Williams',
      email: 'emma@bloghaven.com',
      password: 'author123',
      role: 'author',
      bio: 'UX designer and storyteller. Sharing personal stories and design insights.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      isActive: true,
      isVerified: true,
    });

    const reader = await User.create({
      name: 'John Reader',
      email: 'reader@bloghaven.com',
      password: 'reader123',
      role: 'reader',
      bio: 'Avid reader and learner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      isActive: true,
      isVerified: true,
    });

    console.log('Created users');

    // Create posts
    const posts = [
      {
        title: 'Getting Started with React 19: A Complete Guide',
        content: `<p>React 19 brings exciting new features and improvements to the React ecosystem. In this comprehensive guide, we'll explore what's new and how to get started.</p>

<p>React 19 introduces several groundbreaking features that will change how we build React applications. The React Compiler automatically optimizes your components, eliminating the need for manual memoization in most cases. Actions provide a simplified way to handle form submissions and mutations with built-in loading and error states. The new use() hook allows you to read resources directly in your components, making data fetching more intuitive.</p>

<p>To get started with React 19, simply update your package.json dependencies to the latest version. The migration is straightforward for most applications, though you should review the breaking changes in the official migration guide. The React team has done an excellent job ensuring backward compatibility while introducing these powerful new features.</p>

<p>The React Compiler is perhaps the most exciting addition. It analyzes your components and automatically applies optimizations that previously required careful use of useMemo, useCallback, and React.memo. This means you can focus on writing clear, readable code while the compiler handles performance optimization. In our testing, we've seen performance improvements of 20-40% in complex applications without any manual optimization.</p>

<p>Actions revolutionize how we handle async operations in React. Instead of manually managing loading states, error handling, and form submission logic, Actions provide a declarative way to handle these common patterns. Combined with useTransition, you get automatic pending states and smooth UI updates during async operations.</p>

<p>React 19 represents a significant step forward in making React more powerful and easier to use. Start experimenting with these features today and see how they can improve your development workflow!</p>`,
        excerpt: 'Explore the exciting new features in React 19 including the React Compiler, Actions, and improved Suspense.',
        author: author1._id,
        category: 'tutorial',
        tags: ['react', 'javascript', 'web-development', 'frontend'],
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        upvoteCount: 45,
        commentCount: 12,
        views: 234,
      },
      {
        title: 'Building a Full-Stack Blog with Node.js and MongoDB',
        content: `<p>In this comprehensive tutorial, we'll build a complete blogging platform from scratch using Node.js, Express, and MongoDB. This project will teach you essential full-stack development skills including user authentication, database design, API development, and deployment.</p>

<p>Our blogging platform will include user authentication with JWT tokens, allowing users to securely register, login, and manage their accounts. We'll implement role-based access control so that authors can create and edit their own posts, while admins can manage all content and users. The platform will feature a rich text editor for creating beautifully formatted blog posts, with support for images, code snippets, and markdown formatting.</p>

<p>Setting up the backend starts with initializing a Node.js project and installing the necessary dependencies. We'll use Express as our web framework, Mongoose for MongoDB integration, bcryptjs for password hashing, and jsonwebtoken for authentication. The project structure will follow best practices with separate folders for routes, controllers, models, and middleware.</p>

<p>Database schema design is crucial for a scalable application. We'll create Mongoose models for Users, Posts, and Comments, with proper relationships between them. Each model will include validation, indexes for performance, and virtual properties for computed fields. We'll also implement soft deletes and timestamps for better data management.</p>

<p>Authentication is implemented using JWT tokens stored in HTTP-only cookies for security. When users login, we generate a token containing their user ID and role, which is verified on subsequent requests using middleware. Password reset functionality uses temporary tokens sent via email, ensuring users can securely recover their accounts.</p>

<p>Best practices are emphasized throughout the tutorial. We use environment variables for all sensitive configuration, implement comprehensive error handling with custom error classes, add input validation using express-validator, and write unit tests for critical functionality. The API follows RESTful conventions and returns consistent JSON responses.</p>

<p>Building a blog platform from scratch teaches you essential full-stack development skills that apply to any web application. Take your time with each section, experiment with the code, and don't hesitate to add your own features. The skills you learn here will serve as a foundation for building more complex applications in the future!</p>`,
        excerpt: 'Learn how to build a complete blogging platform with user authentication, posts, and comments using modern technologies.',
        author: author2._id,
        category: 'tutorial',
        tags: ['nodejs', 'mongodb', 'express', 'backend', 'fullstack'],
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        upvoteCount: 78,
        commentCount: 23,
        views: 456,
      },
      {
        title: 'My Journey from Designer to Full-Stack Developer',
        content: `<p>Three years ago, I was a UX designer with no coding experience. Today, I'm a full-stack developer building complex web applications. This is the story of my career transition, including the challenges I faced, the breakthroughs that kept me going, and the lessons I learned along the way.</p>

<p>It all started with curiosity. As a UX designer, I created beautiful mockups and detailed user flows, but I always felt disconnected from the final product. I wanted to understand how to actually implement my designs, not just hand them off to developers. So I began learning HTML and CSS in my spare time, building simple layouts and experimenting with responsive design.</p>

<p>Learning JavaScript was the real challenge. After the relative simplicity of HTML and CSS, JavaScript felt overwhelming. I spent countless nights debugging code, reading documentation, watching tutorials, and feeling like I would never understand it. There were genuine moments where I wanted to give up and stick to design. The syntax was confusing, asynchronous programming made no sense, and don't even get me started on understanding closures and the event loop.</p>

<p>Everything clicked when I built my first complete project - a todo app with local storage persistence. It wasn't revolutionary, but seeing my code come to life was magical. For the first time, I truly understood the connection between the code I wrote and what appeared on screen. That moment changed everything. I realized I could create anything I imagined, limited only by my knowledge and creativity.</p>

<p>My advice for anyone considering a similar transition is to start small and focus on fundamentals. Don't try to learn React, Node.js, databases, and deployment all at once. Master the basics first. Build lots of small projects rather than spending months on one large project. Join online communities where you can ask questions and learn from others. And most importantly, be patient with yourself. Everyone learns at their own pace, and comparing your progress to others will only discourage you.</p>

<p>Today, I work as a full-stack developer at a tech startup, building features that impact thousands of users. I combine my design background with technical skills to create user experiences that are both beautiful and functional. The journey was difficult, filled with frustration and self-doubt, but it was absolutely worth every struggle. My design skills give me an edge as a developer, helping me build interfaces that users actually enjoy.</p>

<p>If you're thinking about learning to code, just start. Don't wait for the perfect time or the perfect course. Take that first step today. You'll surprise yourself with what you can achieve when you commit to the journey!</p>`,
        excerpt: 'A personal story about transitioning from UX design to full-stack development, including challenges, breakthroughs, and advice for beginners.',
        author: author3._id,
        category: 'story',
        tags: ['career', 'learning', 'motivation', 'web-development'],
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        upvoteCount: 156,
        commentCount: 34,
        views: 892,
      },
      {
        title: 'Understanding JavaScript Closures: A Deep Dive',
        content: `<p>Closures are one of the most powerful features in JavaScript, yet they confuse many developers, especially those new to the language. In this comprehensive guide, we'll demystify closures with clear explanations and practical examples that you can apply in your own code.</p>

<p>A closure is essentially a function that has access to variables in its outer function's scope, even after that outer function has returned. This might sound complicated, but it's actually a natural consequence of how JavaScript's scope chain works. When you define a function inside another function, the inner function maintains a reference to the outer function's variables.</p>

<p>Here's a simple example to illustrate the concept. We have an outer function that defines a variable and returns an inner function. Even after the outer function has finished executing, the inner function can still access and use that variable. This is possible because the inner function "closes over" the variables from its outer scope, creating a closure.</p>

<p>Closures have many practical applications in real-world JavaScript development. They're commonly used for data privacy, creating private variables that can't be accessed directly from outside the function. Event handlers often rely on closures to maintain state between events. Callbacks and higher-order functions use closures to preserve context. The module pattern uses closures to create public and private methods, providing encapsulation similar to classes in other languages.</p>

<p>However, closures can also lead to unexpected behavior if you're not careful. A common pitfall involves creating closures in loops, where multiple functions might reference the same variable rather than capturing its value at different iterations. Memory leaks can occur when closures unintentionally hold references to large objects or DOM elements that are no longer needed. Understanding how closures work helps you avoid these issues and write more maintainable code.</p>

<p>Mastering closures is essential for writing effective JavaScript. They're used throughout the language and in popular libraries and frameworks. Take time to practice with different examples, experiment with the code, and pay attention to how closures behave in various situations. Once closures click for you, many advanced JavaScript patterns will suddenly make sense!</p>`,
        excerpt: 'A comprehensive guide to understanding JavaScript closures with practical examples and real-world use cases.',
        author: author1._id,
        category: 'article',
        tags: ['javascript', 'programming', 'closures', 'fundamentals'],
        coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        upvoteCount: 92,
        commentCount: 18,
        views: 567,
      },
      {
        title: '10 CSS Tricks Every Developer Should Know',
        content: `<p>These ten CSS tricks will significantly improve your workflow and help you create better user experiences. Whether you're a beginner or an experienced developer, these techniques will save you time and make your stylesheets more maintainable.</p>

<p>CSS Grid has completely revolutionized how we create layouts on the web. Gone are the days of complex float hacks and positioning nightmares. With CSS Grid, you can create sophisticated two-dimensional layouts with just a few lines of code. It's perfect for everything from simple page layouts to complex dashboard interfaces.</p>

<p>Custom Properties, also known as CSS Variables, bring dynamic theming capabilities to your styles sheets. You can define colors, spacing, and other values once and reuse them throughout your CSS. When you need to change a value, you only update it in one place. They're also incredibly useful for implementing dark mode and other theme variations.</p>

<p>Flexbox centering is the easiest and most reliable way to center content both horizontally and vertically. Simply set display to flex on the container, then use justify-content center and align-items center. No more margin tricks or absolute positioning hacks. It works every time and is fully responsive.</p>

<p>Smooth scrolling improves the user experience when navigating between page sections. Just add scroll-behavior smooth to your html element, and all anchor link navigation becomes smooth and pleasant. It's a tiny addition that makes a noticeable difference in how your site feels to users.</p>

<p>Responsive typography using the clamp function allows text to scale smoothly between minimum and maximum sizes based on viewport width. This creates a much more polished experience across different screen sizes without needing multiple media queries. The text always feels proportional to the viewport.</p>

<p>Other essential tricks include aspect-ratio for maintaining proper image and video proportions, object-fit for controlling how images fill their containers, backdrop-filter for beautiful glassmorphism effects, scroll-snap for creating smooth scrolling sections, and container queries for truly component-based responsive design. Master these techniques and your CSS skills will level up dramatically!</p>`,
        excerpt: 'Discover 10 powerful CSS tricks that will improve your workflow and create better user experiences.',
        author: author2._id,
        category: 'article',
        tags: ['css', 'web-design', 'frontend', 'tips'],
        coverImage: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        upvoteCount: 134,
        commentCount: 27,
        views: 678,
      },
      {
        title: 'The Future of Web Development: Trends to Watch in 2025',
        content: `<p>As we move through 2025, several exciting trends are shaping the future of web development. These technologies and practices are transforming how we build applications and deliver value to users. Understanding these trends will help you stay ahead in your career and make informed decisions about which technologies to invest your time in learning.</p>

<p>AI-powered development tools have become significantly more sophisticated over the past year. GitHub Copilot, Cursor, and similar AI assistants are helping developers write better code faster, catch bugs earlier, and learn new frameworks more quickly. These tools don't replace developers but augment our capabilities, handling boilerplate code and routine tasks so we can focus on solving complex problems.</p>

<p>WebAssembly is enabling near-native performance in web browsers, opening up entirely new possibilities for web applications. We're seeing desktop-class applications running entirely in the browser, from video editing to 3D modeling. Languages like Rust, C++, and Go can now target the web platform, bringing their performance characteristics and ecosystems to web development.</p>

<p>Edge computing is revolutionizing how we think about server architecture. By processing data closer to users, edge functions reduce latency and improve performance dramatically. Platforms like Cloudflare Workers and Vercel Edge Functions make it easy to deploy code that runs at the network edge, providing lightning-fast responses no matter where your users are located.</p>

<p>Progressive Web Apps continue to blur the line between web and native applications. Modern PWAs offer offline functionality, push notifications, and app-like experiences while maintaining the reach and convenience of the web. Companies are increasingly choosing PWAs over native apps for their ability to work across all devices with a single codebase.</p>

<p>Sustainability has become a major focus in web development. Developers are increasingly conscious of the environmental impact of their applications, optimizing for energy efficiency and reduced data transfer. Tools for measuring and improving web sustainability are becoming standard parts of the development workflow. The web is evolving rapidly, and these trends are just the beginning. Stay curious, keep learning, and embrace new technologies as they emerge. The future of web development is incredibly exciting!</p>`,
        excerpt: 'Explore the latest trends shaping web development in 2025, from AI tools to edge computing and sustainability.',
        author: author3._id,
        category: 'article',
        tags: ['web-development', 'trends', 'future', 'technology'],
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        upvoteCount: 203,
        commentCount: 45,
        views: 1245,
      },
      {
        title: 'Building Accessible Websites: A Practical Guide',
        content: `<p>Making your websites accessible isn't just the right thing to do—it's essential for reaching all users and often legally required. Over 1 billion people worldwide have disabilities, and creating accessible websites ensures everyone can use the web regardless of their abilities. This guide provides practical techniques you can implement today to make your websites more accessible.</p>

<p>Web accessibility is built on four key principles. Information must be perceivable, meaning users must be able to perceive the information being presented through at least one of their senses. UI components must be operable by all users, regardless of how they interact with the web. Content must be understandable, with clear language and predictable navigation. Finally, websites must be robust enough to work with current and future user agents and assistive technologies.</p>

<p>Using semantic HTML is the foundation of accessible web development. Elements like header, nav, main, article, and footer provide structure that assistive technologies can understand and navigate. Always use button elements for buttons and anchor tags for links. Proper heading hierarchy helps screen reader users understand your content structure and navigate efficiently.</p>

<p>Images should always include alt text that describes their content and purpose. Decorative images can have empty alt attributes, but informative images need descriptive text. Form inputs must have associated labels, preferably using the label element with a for attribute. Provide clear error messages and guidance when form validation fails.</p>

<p>Keyboard navigation is crucial for users who can't use a mouse. Ensure all interactive elements can be reached and activated using only the keyboard. Visible focus indicators help users see where they are on the page. Skip links allow keyboard users to bypass repetitive navigation and jump straight to main content.</p>

<p>Color contrast ratios must meet WCAG guidelines. Text should have sufficient contrast against its background for users with visual impairments. Don't rely solely on color to convey information; use text labels, patterns, or icons as well. Testing tools like axe, Lighthouse, and WAVE help identify accessibility issues automatically, but manual testing with screen readers is also important.</p>

<p>Accessibility should be built into your development process from the start, not added as an afterthought. Make it a priority in every project, include it in your design reviews, and test with real users who rely on assistive technologies. The web becomes better for everyone when we build with accessibility in mind!</p>`,
        excerpt: 'Learn practical techniques for building accessible websites that work for everyone, including users with disabilities.',
        author: author1._id,
        category: 'tutorial',
        tags: ['accessibility', 'web-development', 'inclusive-design', 'a11y'],
        coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        upvoteCount: 87,
        commentCount: 15,
        views: 423,
      },
      {
        title: 'How I Built My First SaaS Product as a Solo Developer',
        content: `<p>Last year, I built and launched my first SaaS product entirely on my own. It was one of the most challenging and rewarding experiences of my career. Here's everything I learned along the way, from initial idea to profitable product, including the mistakes I made and how I overcame them.</p>

<p>The idea came from my own frustration with existing tools. I noticed fellow developers struggling with a specific problem in their workflow, and existing solutions were either too expensive or too complicated. Before writing a single line of code, I validated the idea by talking to at least 20 potential users. Their feedback shaped the entire product direction and saved me from building features nobody wanted.</p>

<p>Choosing the right tech stack was crucial as a solo developer. I needed technologies I was already familiar with, so I chose React for the frontend, Node.js and Express for the backend, and PostgreSQL for the database. Stripe handled payments and subscriptions, eliminating the complexity of building a payment system from scratch. I deployed the frontend on Vercel and the backend on Railway, both offering generous free tiers and easy deployment.</p>

<p>The development process took six months of working every evening after my day job. Some days I was highly motivated and shipped major features. Other days I was exhausted and forced myself to commit just one line of code. The key was consistency. I set a rule to write at least one commit every day, no matter how small. This kept momentum going even when motivation was low.</p>

<p>The biggest challenges were implementing secure authentication and authorization, handling complex payment flows and subscription management, building a responsive UI that worked across all devices, writing comprehensive documentation that users could actually follow, and marketing the product—which turned out to be harder than building it. Each challenge taught me valuable lessons and pushed me to grow as a developer.</p>

<p>Launch day on Product Hunt was terrifying and exhilarating. I woke up at 5 AM to post the product and spent the entire day responding to comments and feedback. We got 50 users in the first week, and their feedback was invaluable. Many early feature requests came from those initial users, and several of them are still active customers today.</p>

<p>The most important lessons I learned were to start small and iterate based on real user feedback, talk to users constantly and build what they actually need, don't wait for perfection—ship early and improve based on usage, marketing is as important as code so allocate time for it, and celebrate small wins to maintain motivation during the long journey. The product now has over 500 active users and generates enough revenue to cover all its costs with some profit left over. It's not making me rich, but it's profitable and growing steadily. More importantly, I learned that I can build and launch a complete product from scratch. That confidence is worth more than the revenue!</p>`,
        excerpt: 'A solo developer shares the complete journey of building and launching their first SaaS product, including challenges and lessons learned.',
        author: author2._id,
        category: 'story',
        tags: ['saas', 'entrepreneurship', 'solo-developer', 'startup'],
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        upvoteCount: 267,
        commentCount: 56,
        views: 1567,
      },
      {
        title: 'Mastering Git: Beyond the Basics',
        content: `<p>Most developers know the basic Git commands like commit, push, and pull. But Git is incredibly powerful, and learning its advanced features can dramatically improve your workflow and help you handle complex scenarios with confidence. This guide covers essential Git techniques that will level up your version control skills.</p>

<p>Interactive rebase is one of Git's most powerful features. It allows you to clean up your commit history before merging, combining multiple commits, rewording commit messages, and reordering commits. A clean commit history makes code reviews easier and helps future developers understand the evolution of your code. Use it to squash work-in-progress commits into logical, well-documented changesets.</p>

<p>The reflog is your safety net in Git. It tracks every change to your repository's HEAD, meaning you can recover commits that seem lost after a rebase or reset. If you accidentally delete a branch or reset too far, the reflog can save you. It's like having an undo button for almost any Git operation.</p>

<p>Cherry-picking allows you to apply specific commits from one branch to another. This is incredibly useful when you need a specific fix from a feature branch without merging the entire branch. It's also helpful for moving commits that were accidentally made on the wrong branch.</p>

<p>Git bisect is a powerful debugging tool that uses binary search to find the commit that introduced a bug. You provide a known good commit and a known bad commit, and Git automatically checks out commits in between, letting you test each one until it narrows down the problematic commit. This can save hours of manual searching through git log.</p>

<p>Understanding how Git stores data helps you use it more effectively. Git doesn't store diffs—it stores snapshots. Each commit is a complete snapshot of your entire project at that moment. This might seem wasteful, but Git uses clever compression and deduplication to keep the repository size manageable. Branches are just lightweight pointers to commits, which is why creating and switching branches is so fast in Git.</p>

<p>Mastering these advanced Git techniques will make you more confident and productive. You'll spend less time fighting with version control and more time writing code. Practice these commands in a safe test repository until they become second nature!</p>`,
        excerpt: 'Move beyond basic Git commands and learn advanced techniques like interactive rebase, reflog, cherry-pick, and bisect.',
        author: author1._id,
        category: 'tutorial',
        tags: ['git', 'version-control', 'devtools', 'workflow'],
        coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        upvoteCount: 124,
        commentCount: 28,
        views: 689,
      },
      {
        title: 'The Art of Code Reviews: Best Practices',
        content: `<p>Code reviews are one of the most valuable practices in software development, yet they're often done poorly or skipped entirely. A good code review catches bugs, shares knowledge across the team, maintains code quality, and helps developers grow. This guide covers best practices for both reviewers and authors that will make your code reviews more effective and enjoyable.</p>

<p>As an author preparing code for review, keep your pull requests small and focused. Large PRs are overwhelming and more likely to have issues slip through. Aim for changes that can be reviewed in 20-30 minutes. Write a clear description explaining what changed and why. Include screenshots for UI changes and note any areas where you'd like specific feedback.</p>

<p>Test your changes thoroughly before submitting for review. Run the test suite, test edge cases manually, and ensure your code follows the project's style guide. Nothing wastes reviewer time more than having to point out failing tests or obvious style violations that automated tools should catch.</p>

<p>As a reviewer, approach code reviews with empathy and a growth mindset. Remember that there's a person behind the code who put effort into it. Start with positive feedback about what was done well. Frame suggestions as questions rather than demands when appropriate. Instead of "This is wrong", try "Have you considered this approach?"</p>

<p>Focus on important issues during review. Nit-picking about trivial style issues wastes everyone's time—that's what linters are for. Instead, focus on logic errors, architectural concerns, security issues, performance problems, and maintainability. Consider whether each comment is actually worth making, or if it's just a personal preference.</p>

<p>Provide specific, actionable feedback. Vague comments like "this could be better" don't help the author improve. Explain why something is problematic and suggest alternatives. If you're unsure about something, ask questions to understand the author's reasoning. Sometimes there's a good reason for an approach that isn't immediately obvious.</p>

<p>The best code reviews are conversations, not lectures. Both reviewer and author should be learning from each other. Don't be afraid to say "I learned something new" when the author teaches you a better approach. This creates a positive culture where everyone feels comfortable sharing knowledge. Remember, the goal is to ship better code and help the team grow, not to prove who's smarter!</p>`,
        excerpt: 'Learn best practices for conducting effective code reviews that catch bugs, share knowledge, and help developers grow.',
        author: author3._id,
        category: 'article',
        tags: ['code-review', 'best-practices', 'teamwork', 'software-engineering'],
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        upvoteCount: 198,
        commentCount: 42,
        views: 876,
      },
      {
        title: 'TypeScript Tips for React Developers',
        content: `<p>TypeScript has become the standard for React development, and for good reason. It catches errors at compile time, provides excellent IDE autocomplete, serves as living documentation for your components, and makes refactoring safer and easier. This guide covers essential TypeScript patterns and tips specifically for React developers looking to level up their type-safety game.</p>

<p>Component props typing is fundamental in React TypeScript. Define interfaces for your component props with clear names and descriptions. Use optional properties when appropriate, and leverage union types for props that accept multiple specific values. Default props should be typed carefully, and you can use utility types like Partial or Required to modify existing prop types.</p>

<p>React hooks have specific TypeScript patterns that differ from regular JavaScript. useState can usually infer its type from the initial value, but you may need to provide a generic when the initial value is null. useRef needs different types depending on whether you're storing a mutable value or a DOM reference. useReducer benefits from discriminated unions for action types, ensuring type safety throughout your state management logic.</p>

<p>Event handlers in React have specific types that can be tricky at first. Use React.MouseEvent, React.ChangeEvent, and similar types rather than the native DOM event types. You can get more specific by adding the element type as a generic parameter. For form submissions, preventDefault has the correct type automatically when you use the right event type.</p>

<p>Generic components are powerful for creating reusable, type-safe components. You can create components that accept a generic type parameter, allowing the component to work with different data types while maintaining full type safety. This is especially useful for components like tables, lists, and form inputs that work with various data structures.</p>

<p>Utility types provided by TypeScript and React can dramatically reduce boilerplate. Omit removes properties from a type, Pick selects specific properties, Partial makes all properties optional, and Required makes them all required. React provides ComponentProps to extract prop types from existing components, and ReturnType to get the return type of any function.</p>

<p>The key to mastering TypeScript in React is to start simple and gradually adopt more advanced patterns as you need them. Don't try to type everything perfectly from the start—it's okay to use any occasionally while learning. Over time, you'll develop intuition for when strong typing adds value and when it's just ceremony. The investment in learning TypeScript pays dividends in reduced bugs and improved developer experience!</p>`,
        excerpt: 'Essential TypeScript patterns and tips for React developers, from props typing to generic components and utility types.',
        author: author2._id,
        category: 'tutorial',
        tags: ['typescript', 'react', 'javascript', 'types'],
        coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        upvoteCount: 165,
        commentCount: 31,
        views: 745,
      },
      {
        title: 'Building a REST API with Express: Complete Guide',
        content: `<p>Express.js is the most popular web framework for Node.js, and for good reason. It's minimalist, flexible, and perfect for building REST APIs. This comprehensive guide will take you from the basics of setting up an Express server to implementing authentication, error handling, and following REST best practices.</p>

<p>Start by initializing a new Node.js project and installing Express along with essential middleware. You'll need body-parser for parsing JSON requests, cors for handling cross-origin requests, and helmet for security headers. Structure your project with separate folders for routes, controllers, middleware, and models to keep code organized as your API grows.</p>

<p>REST principles guide how you design your API endpoints. Resources are nouns, not verbs, and HTTP methods indicate the action. GET retrieves resources, POST creates them, PUT or PATCH updates them, and DELETE removes them. Use proper status codes: 200 for success, 201 for created resources, 400 for client errors, 404 for not found, and 500 for server errors. Consistent naming and response formats make your API predictable and easy to use.</p>

<p>Middleware is the heart of Express. It's functions that execute during the request-response cycle, having access to the request and response objects. Use middleware for authentication, logging, error handling, request validation, and more. The order of middleware matters—authentication should come before route handlers, and error handling middleware should be last.</p>

<p>Error handling in Express requires a centralized approach. Create custom error classes for different types of errors, use async/await with try-catch blocks, and implement a global error handler middleware. This middleware should format errors consistently, log them appropriately, and return safe error messages to clients without exposing sensitive information.</p>

<p>Authentication is typically implemented with JWT tokens. When users log in with valid credentials, generate a token containing their user ID and role. On subsequent requests, verify the token in authentication middleware. Store sensitive information like passwords as salted hashes using bcrypt, never in plain text. Implement refresh tokens for longer sessions and password reset flows using temporary tokens.</p>

<p>Input validation prevents bugs and security issues. Use libraries like express-validator or joi to validate request data before processing it. Check that required fields are present, data types are correct, and values meet your constraints. Return clear error messages when validation fails. Proper validation at the API level protects your database and business logic from invalid data. Building a well-designed REST API with Express sets a solid foundation for any web application. Take time to structure your code well, follow REST principles, and implement proper error handling and security. Your future self and your users will thank you!</p>`,
        excerpt: 'A complete guide to building REST APIs with Express.js, covering routing, middleware, authentication, and best practices.',
        author: author1._id,
        category: 'tutorial',
        tags: ['nodejs', 'express', 'rest-api', 'backend'],
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        status: 'published',
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        upvoteCount: 142,
        commentCount: 25,
        views: 634,
      },
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`Created ${createdPosts.length} posts`);

    // Add some upvotes
    const post1 = createdPosts[0];
    post1.upvotes = [reader._id, author2._id, author3._id];
    await post1.save();

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Email: admin@bloghaven.com');
    console.log('   Password: admin123');
    console.log('\n✍️  Author (Sarah):');
    console.log('   Email: sarah@bloghaven.com');
    console.log('   Password: author123');
    console.log('\n✍️  Author (Michael):');
    console.log('   Email: michael@bloghaven.com');
    console.log('   Password: author123');
    console.log('\n✍️  Author (Emma):');
    console.log('   Email: emma@bloghaven.com');
    console.log('   Password: author123');
    console.log('\n👁️  Reader:');
    console.log('   Email: reader@bloghaven.com');
    console.log('   Password: reader123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
