import { LearningModule } from '../types';

export const SAMPLE_TOPICS: Record<string, LearningModule> = {
  'quantum-superposition': {
    topic: 'Quantum Superposition',
    learnerLevel: 'high_school',
    learningStyle: 'analogy',
    title: 'Quantum Superposition: Being in Multiple States at Once',
    oneLiner: 'In the quantum realm, a particle can exist in multiple possible states simultaneously until someone measures it.',
    bigPicture:
      'In our normal everyday world, a light switch is either ON or OFF. A coin on a table is either heads or tails. But when we zoom down into the atomic realm—the world of electrons and photons—particles do not play by everyday rules. Instead of having one fixed state, they exist in a cloud of probabilities known as "superposition". It is not that we are simply ignorant of where the particle is; the particle is literally mathematically occupying multiple possibilities at the exact same moment. This strange property is the core engine behind quantum computing, allowing quantum computers to evaluate vast amounts of data simultaneously.',
    analogy: {
      title: 'The Spinning Coin on a Table',
      story:
        'Imagine you spin a shiny quarter on a tabletop. While it is spinning rapidly, is it Heads or is it Tails? It is neither strictly Heads nor strictly Tails! It is a blurry blur of both possibilities at once. Only when you slap your hand down on the coin and stop it does it abruptly "collapse" into a definite Heads or Tails. Superposition is just like that spinning coin: until an observation or measurement happens, nature keeps all possibilities swirling in play.',
      keyTakeaway:
        'Measurement forces nature to choose a single outcome, collapsing the wave of possibilities into concrete reality.',
    },
    keySteps: [
      {
        stepNumber: 1,
        title: 'Wave-Particle Duality',
        explanation: 'Subatomic particles behave not just like tiny hard billiard balls, but like continuous ripples in an ocean.',
        keyInsight: 'Waves can overlap and combine—this is where multiple states meet.',
      },
      {
        stepNumber: 2,
        title: 'The Probability Wavefunction',
        explanation: 'Physicists describe quantum particles using Schrödinger’s equation, which charts the mathematical odds of finding a particle in various states.',
        keyInsight: 'The math describes potential, not a guaranteed single coordinate.',
      },
      {
        stepNumber: 3,
        title: 'Superposition in Action',
        explanation: 'Before interaction with the environment, the particle exists as a linear sum of all valid solutions.',
        keyInsight: 'A qubit can represent both 0 and 1 at the same time.',
      },
      {
        stepNumber: 4,
        title: 'The Measurement Collapse',
        explanation: 'The moment a detector or photon interacts with the quantum particle, the superposition snaps into a single definite classical value.',
        keyInsight: 'Observation is an active physical interaction that destroys the delicate quantum superposition.',
      },
    ],
    realWorldExamples: [
      {
        title: 'Quantum Computers (Qubits)',
        scenario: 'Classical computers process bits that are strictly 0 or 1. A quantum computer uses qubits in superposition.',
        application: 'Allows algorithms to explore millions of cryptographic keys or molecular simulations simultaneously.',
      },
      {
        title: 'Photosynthesis in Plants',
        scenario: 'Chlorophyll molecules transport captured sunlight energy across cellular antenna complexes.',
        application: 'Biologists discovered that quantum superposition allows excitation energy to sample every route at once, finding the quickest path with near 100% efficiency.',
      },
      {
        title: 'Atomic Clocks & GPS',
        scenario: 'Cesium atoms transition between energy states.',
        application: 'Superposition enables hyper-accurate microwave resonance, keeping global GPS satellites synchronized to within nanoseconds.',
      },
    ],
    commonMistakes: [
      {
        myth: 'The particle is secretly in one definite state, and we just do not know which.',
        reality: 'Bell’s Theorem proved through decades of experiments that there are no "hidden variables". Nature genuinely exists in a superposition of possibilities until measured.',
        whyItConfusesPeople: 'Our everyday brains evolved watching rocks and apples, which cannot be in two places at once.',
      },
      {
        myth: 'Superposition means an object can be physically cloned to duplicate information.',
        reality: 'The "No-Cloning Theorem" shows that unknown quantum states cannot be duplicated without disturbing them.',
        whyItConfusesPeople: 'Digital classical data can be copy-pasted infinitely, but quantum data cannot.',
      },
    ],
    cheatSheet: {
      keyTerms: [
        { term: 'Superposition', definition: 'The ability of a quantum system to be in multiple states simultaneously.' },
        { term: 'Wavefunction', definition: 'The mathematical equation representing the probability amplitudes of quantum states.' },
        { term: 'Qubit', definition: 'A quantum bit capable of encoding 0, 1, or both concurrently.' },
        { term: 'Wavefunction Collapse', definition: 'The abrupt reduction of a multi-state quantum system to a single eigenstate upon measurement.' },
      ],
      goldenRule: 'While spinning, it is both; when slapped down, it is one.',
      formulaOrRule: '|Ψ⟩ = α|0⟩ + β|1⟩ (where |α|² + |β|² = 1)',
    },
    flashcards: [
      {
        front: 'What is a Qubit?',
        back: 'The basic unit of quantum information that can exist in a superposition of state 0 and state 1 simultaneously.',
        category: 'Quantum Computing',
      },
      {
        front: 'What does "wavefunction collapse" mean?',
        back: 'When a quantum particle in superposition interacts with a measurement device and suddenly assumes a single definite value.',
        category: 'Quantum Mechanics',
      },
      {
        front: 'How is a classical bit different from a quantum qubit?',
        back: 'A classical bit can only be 0 OR 1. A qubit can be 0, 1, or any superposition combination of both.',
        category: 'Fundamentals',
      },
      {
        front: 'What did the famous "Schrödinger’s Cat" thought experiment demonstrate?',
        back: 'The paradox of linking a microscopic quantum superposition (decayed vs intact atom) to a macroscopic object (a cat that would be both alive and dead until opened).',
        category: 'Thought Experiments',
      },
    ],
    quiz: [
      {
        question: 'What happens to a quantum particle in superposition when it is measured by a detector?',
        options: [
          'It continues in superposition forever.',
          'It collapses into a single, definite classical state.',
          'It instantly multiplies into two separate particles.',
          'It loses all its energy and disappears.',
        ],
        correctIndex: 1,
        explanation: 'Interacting with a detector causes wavefunction collapse, forcing the system to reveal a single concrete value.',
      },
      {
        question: 'Which everyday analogy best describes quantum superposition?',
        options: [
          'A light bulb turned completely off.',
          'A train riding strictly on a single rail.',
          'A spinning coin that is neither heads nor tails until it stops.',
          'A library book sitting quietly on a shelf.',
        ],
        correctIndex: 2,
        explanation: 'While spinning, the coin embodies both states until observation/stopping forces one.',
      },
      {
        question: 'Why are qubits in superposition advantageous for specific computing tasks?',
        options: [
          'They do not require any electricity to run.',
          'They allow computers to explore multiple computational paths simultaneously.',
          'They make computer screens brighter and crisper.',
          'They replace the need for software programming.',
        ],
        correctIndex: 1,
        explanation: 'Superposition allows quantum algorithms to process complex combinations in parallel rather than one by one.',
      },
    ],
    suggestedFollowUps: [
      'What is Quantum Entanglement and how is it connected to superposition?',
      'How does Quantum Teleportation work in physics labs?',
      'Why does environmental heat destroy quantum computers so easily (decoherence)?',
    ],
    createdAt: new Date().toISOString(),
  },
  'how-inflation-works': {
    topic: 'How Inflation Works',
    learnerLevel: 'middle_school',
    learningStyle: 'analogy',
    title: 'How Inflation Works: Why Your Dollars Buy Less Over Time',
    oneLiner: 'Inflation is the general rise in prices over time, which means each dollar in your pocket buys fewer goods and services.',
    bigPicture:
      'Have you ever heard your grandparents say, "When I was your age, a movie ticket and popcorn cost fifty cents"? Today, that same ticket might cost fifteen dollars! That does not necessarily mean movies became thirty times better; it means the buying power of money changed. This ongoing rise in the general price tag of everyday goods—from bread and sneakers to rent and gasoline—is called inflation. When inflation is low and predictable (around 2% per year), it actually helps grease the wheels of a growing economy. But when prices skyrocket too fast, families feel the pinch because their wages struggle to keep up with the grocery bill.',
    analogy: {
      title: 'The Rare Pokémon Cards in the Schoolyard',
      story:
        'Imagine in your school there are only 5 ultra-rare holographic Charizard cards. Because they are so scarce, people trade 10 ordinary cards or whole lunchboxes just to get one! Now imagine the company prints 10,000 Charizards and drops them from a helicopter into the schoolyard. Suddenly everyone has pockets full of Charizards. If you offer someone a Charizard for a cookie now, they might say, "No thanks, I have ten already—give me five Charizards for that cookie!" When there is too much currency chasing the exact same amount of stuff, each individual unit loses value.',
      keyTakeaway: 'Prices rise when more money chases the same or fewer goods.',
    },
    keySteps: [
      {
        stepNumber: 1,
        title: 'Demand-Pull Inflation',
        explanation: 'When lots of buyers have cash and want to purchase the same hot items, sellers raise their prices because demand outstrips supply.',
        keyInsight: '"Too much money chasing too few goods."',
      },
      {
        stepNumber: 2,
        title: 'Cost-Push Inflation',
        explanation: 'If the raw ingredients or materials get more expensive (like oil, wheat, or microchips), businesses must raise their final shelf prices to stay profitable.',
        keyInsight: 'Higher production costs get passed down to the customer.',
      },
      {
        stepNumber: 3,
        title: 'Wage-Price Spiral',
        explanation: 'As living costs rise, workers ask their bosses for raises. To pay higher wages, businesses raise prices again, creating a circular loop.',
        keyInsight: 'Expectations of future inflation can become a self-fulfilling prophecy.',
      },
      {
        stepNumber: 4,
        title: 'Central Bank Response (Interest Rates)',
        explanation: 'Central banks (like the Federal Reserve) raise interest rates to make borrowing money more expensive, cooling down spending.',
        keyInsight: 'Tapping the economic brakes slows price hikes.',
      },
    ],
    realWorldExamples: [
      {
        title: 'The Price of a Candy Bar over 50 Years',
        scenario: 'A Hershey chocolate bar was $0.05 in 1960 and is around $1.75 today.',
        application: 'Illustrates how persistent ~2-3% annual inflation gradually alters the baseline cost of everyday snacks.',
      },
      {
        title: 'Supply Chain Bottlenecks (Cost-Push)',
        scenario: 'During shipping delays, container cargo prices quintupled.',
        application: 'Bicycle and electronics manufacturers had to increase sticker prices because freight was dramatically costlier.',
      },
      {
        title: 'Savings Accounts & Purchasing Power',
        scenario: 'Leaving $1,000 under a mattress for 20 years with 3% inflation.',
        application: 'You still have $1,000 in paper bills, but it will only buy what $553 buys today.',
      },
    ],
    commonMistakes: [
      {
        myth: 'All inflation is evil and zero inflation is always ideal.',
        reality: 'Modest, stable inflation (around 2%) encourages people and companies to invest and spend rather than hoard cash, preventing harmful deflationary freezes.',
        whyItConfusesPeople: 'Nobody likes seeing higher prices on stickers, but deflation (falling prices) often causes mass layoffs.',
      },
      {
        myth: 'Inflation happens only because business owners suddenly decided to get greedy.',
        reality: 'While profit margins can fluctuate, systemic inflation across the whole economy is driven by money supply, interest rates, energy shocks, and aggregate supply and demand.',
        whyItConfusesPeople: 'It is easy to blame the last person holding the cash register.',
      },
    ],
    cheatSheet: {
      keyTerms: [
        { term: 'Inflation', definition: 'The rate at which the general level of prices for goods and services rises over time.' },
        { term: 'Purchasing Power', definition: 'The amount of real goods and services that a single unit of currency can buy.' },
        { term: 'CPI (Consumer Price Index)', definition: 'A standard basket of goods (food, fuel, housing) tracked to measure inflation rates.' },
        { term: 'Interest Rate', definition: 'The cost of borrowing money, used by central banks as a thermostat for the economy.' },
      ],
      goldenRule: 'Inflation doesn’t just make prices go up; it makes money go down.',
      formulaOrRule: 'Real Return = Nominal Interest Rate - Inflation Rate',
    },
    flashcards: [
      {
        front: 'What does "Purchasing Power" mean?',
        back: 'The quantity of goods and services that a given amount of money can actually purchase.',
        category: 'Economics 101',
      },
      {
        front: 'What is the difference between Demand-Pull and Cost-Push inflation?',
        back: 'Demand-pull happens when eager buyers bid prices up; cost-push happens when raw materials or production costs increase.',
        category: 'Mechanics',
      },
      {
        front: 'Why do central banks raise interest rates when inflation is high?',
        back: 'To make borrowing and spending more expensive, which cools down demand and slows price increases.',
        category: 'Monetary Policy',
      },
      {
        front: 'What is Deflation and why is it dangerous?',
        back: 'Deflation is when prices broadly fall. It causes consumers to postpone buying, leading to business closures and job losses.',
        category: 'Economic Concepts',
      },
    ],
    quiz: [
      {
        question: 'If annual inflation is 5%, what will happen to a $100 grocery cart next year?',
        options: [
          'It will cost $95.',
          'It will cost $105.',
          'It will cost $150.',
          'It will remain exactly $100.',
        ],
        correctIndex: 1,
        explanation: 'At 5% inflation, the cost of the basket increases by 5% of $100, which is $5, totaling $105.',
      },
      {
        question: 'What is Cost-Push inflation primarily caused by?',
        options: [
          'Governments handing out free video games.',
          'Rising costs of raw materials, energy, or labor to manufacture products.',
          'Banks having too much physical cash in their vaults.',
          'Consumers refusing to buy new clothes.',
        ],
        correctIndex: 1,
        explanation: 'Cost-push happens when production expenses rise, forcing businesses to raise prices.',
      },
      {
        question: 'Why is keeping cash hidden under a mattress risky during high inflation?',
        options: [
          'The ink on the money slowly fades away.',
          'Your purchasing power silently erodes as prices rise around you.',
          'Banks can legally take money from under beds.',
          'Paper currency expires after 12 months.',
        ],
        correctIndex: 1,
        explanation: 'While the nominal number of bills stays the same, their purchasing power drops as everyday prices climb.',
      },
    ],
    suggestedFollowUps: [
      'What causes hyperinflation like in 1920s Germany or modern Zimbabwe?',
      'How does investing in index funds or real estate protect against inflation?',
      'What is Shrinkflation and how do brands use it?',
    ],
    createdAt: new Date().toISOString(),
  },
  'recursion-in-programming': {
    topic: 'Recursion in Computer Science',
    learnerLevel: 'college',
    learningStyle: 'analogy',
    title: 'Recursion: When a Problem Solves Itself by Solving a Smaller Self',
    oneLiner: 'Recursion is a programming technique where a function calls itself to solve a smaller sub-instance of the same problem until reaching a base case.',
    bigPicture:
      'In computer science and mathematics, complex problems can often feel overwhelming. However, many of the most intricate structures—such as file directories on your computer, HTML document trees in a web browser, or family genealogies—are naturally self-similar. Recursion is an elegant computational paradigm where instead of writing endless nested loops, a function simply solves one small step and delegates the remaining work to an identical copy of itself. Understanding recursion transforms how you think about algorithms, dynamic programming, and tree traversals.',
    analogy: {
      title: 'The Russian Matryoshka Nesting Dolls & The Line at the Cinema',
      story:
        'Imagine you are sitting in a giant dark movie theater and want to know which row number you are in, but you cannot see the screen numbers. What do you do? You tap the shoulder of the person directly in front of you and ask: "What row are you in?" That person does not know either! So they tap the person in front of THEM: "What row are you in?" This keeps repeating down the line. Finally, the person in the very front row (Row 1) says: "I am in Row 1!" (The Base Case). Now the message bubbles backwards: the second row knows they are in Row 2, the third knows Row 3, until the answer reaches you!',
      keyTakeaway:
        'Each person does one trivial addition (My row = person in front + 1) and relies on the base case to stop the chain.',
    },
    keySteps: [
      {
        stepNumber: 1,
        title: 'The Base Case (The Guard Rail)',
        explanation: 'Every recursive function MUST have a condition that returns a value directly without making another recursive call. Without this, you get infinite recursion.',
        keyInsight: 'The base case is where the recursion stops and starts unwinding.',
      },
      {
        stepNumber: 2,
        title: 'The Recursive Step (Reduction)',
        explanation: 'The function calls itself with a strictly smaller or simpler input (e.g. n - 1, or rest of list).',
        keyInsight: 'Progress must always move towards the base case.',
      },
      {
        stepNumber: 3,
        title: 'The Call Stack Allocation',
        explanation: 'Each function invocation creates a new stack frame in memory storing local variables and return addresses.',
        keyInsight: 'The computer remembers where each partial calculation was paused.',
      },
      {
        stepNumber: 4,
        title: 'Unwinding & Resolution',
        explanation: 'Once the base case is hit, stack frames resolve and pop off in reverse order (LIFO: Last In, First Out).',
        keyInsight: 'The final answer is constructed as the stack frames return up the chain.',
      },
    ],
    realWorldExamples: [
      {
        title: 'File System Folders on Your Computer',
        scenario: 'A folder can contain files AND subfolders, which contain files and more subfolders.',
        application: 'To calculate total disk space or search for a file, a recursive scanner opens each folder, calls itself on child folders, and sums the bytes.',
      },
      {
        title: 'DOM Rendering in Web Browsers',
        scenario: 'An HTML document is a tree of nested tags: <div> containing <section> containing <p>.',
        application: 'Browser engines render layout by recursively calculating coordinates from root parent nodes to leaf elements.',
      },
      {
        title: 'Fractals and Natural Growth',
        scenario: 'A tree trunk splits into two branches; each branch splits into two smaller branches.',
        application: '3D game graphics generate realistic mountains, rivers, and trees using recursive procedural algorithms.',
      },
    ],
    commonMistakes: [
      {
        myth: 'Recursion is always faster and better than standard loops (for/while).',
        reality: 'Recursion incurs stack frame overhead and risk of "Stack Overflow" errors if depth is too high. Iteration is often faster unless tail-call optimization is supported.',
        whyItConfusesPeople: 'Recursion looks elegant and short in code, but under the hood, memory frames accumulate.',
      },
      {
        myth: 'You can write recursion without a base case if your math is clever.',
        reality: 'Without a base case, the computer will call the function indefinitely until memory is exhausted, throwing a fatal Maximum Call Stack Size Exceeded error.',
        whyItConfusesPeople: 'Beginners forget the exit check or place it after the recursive call.',
      },
    ],
    cheatSheet: {
      keyTerms: [
        { term: 'Base Case', definition: 'The terminating condition where no further recursive call is made.' },
        { term: 'Call Stack', definition: 'The stack data structure tracking active subroutine calls in memory.' },
        { term: 'Stack Overflow', definition: 'A runtime error caused when recursive calls exceed allocated stack memory.' },
        { term: 'Divide and Conquer', definition: 'An algorithm design pattern that breaks a problem into recursive sub-problems (e.g., MergeSort).' },
      ],
      goldenRule: 'Two mandatory rules: 1) Must have a base case. 2) Every call must move closer to that base case.',
      formulaOrRule: 'f(n) = n == 0 ? 1 : n * f(n - 1)',
    },
    flashcards: [
      {
        front: 'What is the role of the "Base Case" in recursion?',
        back: 'To stop the recursive loop by returning a concrete value without making another self-call.',
        category: 'Algorithms',
      },
      {
        front: 'What causes a "Stack Overflow" error?',
        back: 'When recursive calls continue indefinitely without hitting a base case, exhausting the memory allocated for the call stack.',
        category: 'Debugging',
      },
      {
        front: 'Why are recursive algorithms naturally suited for tree and graph structures?',
        back: 'Because trees are recursive data structures: each sub-branch is itself a smaller tree.',
        category: 'Data Structures',
      },
      {
        front: 'What is "Memoization" in recursive algorithms?',
        back: 'Caching the results of expensive recursive calls so identical inputs are not recomputed repeatedly (key to Dynamic Programming).',
        category: 'Optimization',
      },
    ],
    quiz: [
      {
        question: 'What happens if a recursive function does not define a valid base case?',
        options: [
          'The function automatically converts into a for-loop.',
          'The program throws a Stack Overflow error because memory is exhausted.',
          'The compiler fixes it automatically at build time.',
          'The return value defaults to zero.',
        ],
        correctIndex: 1,
        explanation: 'Without a base case, the function calls itself infinitely until the call stack exceeds its memory limit.',
      },
      {
        question: 'Which of the following problems is most naturally solved recursively?',
        options: [
          'Calculating 2 + 2.',
          'Traversing a hierarchical folder directory on a hard drive.',
          'Changing the color of a button on click.',
          'Finding the length of a fixed 3-character string.',
        ],
        correctIndex: 1,
        explanation: 'Folder directories are recursive tree structures where folders contain subfolders indefinitely.',
      },
      {
        question: 'In the theater row analogy, what represents the "Base Case"?',
        options: [
          'The usher walking down the aisle.',
          'The person in Row 1 who knows their row without asking anyone in front.',
          'The popcorn machine at the lobby.',
          'The last row of the auditorium.',
        ],
        correctIndex: 1,
        explanation: 'The person in Row 1 does not need to ask anyone else; they return the base value directly.',
      },
    ],
    suggestedFollowUps: [
      'What is Tail Call Optimization and why does it matter?',
      'How does the MergeSort algorithm use recursion to sort millions of items fast?',
      'How does Memoization convert an exponential O(2^n) Fibonacci into linear O(n)?',
    ],
    createdAt: new Date().toISOString(),
  },
};

export const POPULAR_PROMPTS = [
  { topic: 'Quantum Superposition', category: 'Physics', icon: 'Atom', badge: 'Mind-Bending' },
  { topic: 'How Inflation Works', category: 'Economics', icon: 'TrendingUp', badge: 'Everyday Life' },
  { topic: 'Recursion in Computer Science', category: 'Tech & Code', icon: 'Code', badge: 'Algorithms' },
  { topic: 'Photosynthesis & Calvin Cycle', category: 'Biology', icon: 'Leaf', badge: 'Natural World' },
  { topic: 'Black Holes & Event Horizons', category: 'Astronomy', icon: 'Sparkles', badge: 'Cosmos' },
  { topic: 'How Neural Networks & LLMs Learn', category: 'AI & Data', icon: 'Brain', badge: 'Cutting Edge' },
  { topic: 'Epigenetics: How Environment Shapes Genes', category: 'Genetics', icon: 'Dna', badge: 'Fascinating' },
  { topic: 'Game Theory & The Prisoner’s Dilemma', category: 'Math & Logic', icon: 'Compass', badge: 'Strategy' },
];
