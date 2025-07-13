# Symphonic Mood Therapy

*An AI-powered application that analyzes your emotional state through text and visuals to generate personalized, therapeutic symphonic music compositions.*

---

## 🎵 About The Project

Symphonic Mood Therapy is an innovative web application that bridges the gap between technology and emotional well-being. By leveraging the power of Google's Gemini large language model, it provides users with a unique form of music therapy. Users can describe their feelings in their own words, and optionally provide a visual cue by taking a photo, to receive a bespoke symphonic concept designed to soothe, uplift, or energize them. The application then searches the vast Deezer music catalog to find a matching soundtrack, offering an immediate auditory experience.

### Key Features

- **🧠 Multimodal Emotional Analysis:** Utilizes Google's Gemini model to analyze both text and image inputs for a more holistic understanding of the user's emotional state.
- **🎼 Custom Symphony Generation:** Generates a detailed description of a therapeutic symphony, including a title, mood, compositional style, instrumentation, and specific therapeutic elements.
- **📸 Integrated Camera:** Allows users to capture their facial expression, providing rich, non-verbal context to the AI.
- **🎧 Dynamic Soundtrack Search:** Integrates with the Deezer API to find real-world music that matches the generated mood, offering a vast library for discovery.
- **✨ Modern & Responsive UI:** A sleek, dark-mode interface built with React and Tailwind CSS, ensuring a seamless experience on both desktop and mobile devices.

## 🛠️ Built With

This project is built with a modern frontend stack:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: For static typing and improved developer experience.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **@google/genai**: The official Google Gemini API SDK for the browser.
- **Deezer API**: For searching and streaming music previews.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need a modern web browser and a way to serve static files. If you have Node.js installed, you can use the `serve` package.

### Installation & Setup

1.  **Get the Code**
    
    Clone or download the project files to your local machine.

2.  **API Key Configuration**
    
    This application requires a Google Gemini API key to function.
    
    -   Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   The application is coded to securely access this key from an environment variable named `API_KEY`. You must configure this variable in your deployment environment, as the application expects `process.env.API_KEY` to be available.

3.  **Run Locally**
    
    Since the project uses standard web technologies, you can run it using any simple local web server.
    
    -   Navigate to the project directory in your terminal.
    -   Using the `serve` package (requires Node.js):
        ```sh
        npx serve
        ```
    -   Open your web browser and go to the URL provided by the server (e.g., `http://localhost:3000`).

## 📖 How It Works

1.  **Describe Your Feelings:** The user enters text into the "Your Emotional Canvas" text area.
2.  **(Optional) Add Visual Context:** The user can click to open their camera and capture a photo. This adds another layer of emotional data for analysis.
3.  **Generate Symphony:** Upon clicking "Generate My Symphony", the app sends the text and/or image data to the Gemini API.
4.  **AI Analysis:** The Gemini model, guided by a detailed system prompt, analyzes the inputs and generates a JSON object describing a therapeutic symphony.
5.  **Display Results:** The app parses the JSON and displays the symphony's title, mood, style, and other characteristics in a beautifully formatted output panel.
6.  **Find Soundtrack:** The user can then click "Find My Soundtrack".
7.  **Search Deezer:** The app constructs a search query from the symphony's mood and style and queries the public Deezer API.
8.  **Stream Preview:** The app fetches the top matching track from Deezer and loads its 30-second audio preview into the player for immediate listening.
