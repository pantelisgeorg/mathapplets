# Math Applets Collection

A collection of interactive mathematics applets — originally written as Java applets — reimagined for the web using HTML5 Canvas, [Math.js](https://mathjs.org/), and React. Each applet lets you explore a concept from calculus, graphing, or statistics by typing expressions and manipulating parameters in real time.

## Applets

| Applet | Description | Topic |
| --- | --- | --- |
| **Derivatives** | Explore functions and their derivatives with tangent lines. | Calculus |
| **Simple Graph** | Basic function plotter. | Graphing |
| **Multi Graph** | Plot multiple functions simultaneously. | Graphing |
| **Families of Graphs** | Explore function families with a parameter slider. | Graphing |
| **Animated Graph** | Automatically animate function parameters. | Animation |
| **Secant & Tangent** | Visualize the limit definition of the derivative. | Calculus |
| **Function Composition** | Visualize f(g(x)). | Functions |
| **Evaluator** | Evaluate mathematical expressions. | Tools |
| **Parametric Curves** | Plot curves defined by x(t) and y(t). | Parametric |
| **Riemann Sums** | Visualize integration via rectangle approximation. | Calculus |
| **Integral Curves** | Vector fields and direction fields. | Differential Equations |
| **Scatter Plot** | Plot data points and regression lines. | Statistics |
| **Epsilon Delta** | Visualize the formal definition of a limit. | Calculus |

## Tech Stack

- [Vite](https://vitejs.dev/) — build tool and dev server
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — styling and UI components
- [Math.js](https://mathjs.org/) — expression parsing and evaluation
- HTML5 Canvas — plotting and rendering
- [React Router](https://reactrouter.com/) — client-side routing
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — testing

## Getting Started

Requires [Node.js](https://nodejs.org/) (18+) and npm.

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd mathapplets

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at the URL printed in your terminal (default `http://localhost:8080`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build for production. |
| `npm run build:dev` | Build using development mode. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the test suite once. |
| `npm run test:watch` | Run tests in watch mode. |

## Project Structure

```
src/
├── components/      Shared components (AppletLayout, MathCanvas, NavLink) and shadcn/ui
├── pages/           One page per applet, plus Index (home) and NotFound
├── hooks/           Custom React hooks
├── integrations/    Supabase client
├── lib/             Utilities
└── test/            Test setup
```

## License

Released under the [MIT License](LICENSE). Copyright © George Pantelis.

## Background

This is a modern web-based version of an old source code for JAVA applets (by David J. Eck) that I found searching the internet. The applet source code can still be run with Java JDKs 8–17. We built the web-based version using HTML5 Canvas and Math.js together with the Cline AI editor using DeepSeek and Gemini 3 preview LLMs.
