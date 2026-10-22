# Polo Studios AI Assistant
A browser-based conversational guide embedded throughout Polo Studios, Fragrance Library, MiniAmazon, and Casino Simulator.

Instant intent/keyword retrieval works without a server. Visitors may optionally enable real semantic AI retrieval: Transformers.js 3.8.1 runs the quantized Xenova/all-MiniLM-L6-v2 embedding model in a Web Worker using ONNX/WASM. It compares questions to curated public project records. This is retrieval, not a generative LLM: answers are authored public facts with explicit navigation links.

The optional model downloads from Hugging Face; the runtime loads from jsDelivr. Those hosts receive ordinary download requests, not chat questions. The chat stays in memory and is cleared on reload/New chat. The browser may cache downloaded model files. No credentials, private account state, purchase data, or collection data are read. CDN/model failure leaves instant search available. No paid API key is needed.

Edit knowledge.js when project facts change. Embed widget.js with data-context portfolio/fragrance/mini/casino/fras. The widget uses an accessible modal iframe and Shadow DOM; it does not manipulate the host app. Links require visitor clicks.

Run: npm test. Serve the repository root with a static server for browser testing. Created October 22, 2026; active development.
