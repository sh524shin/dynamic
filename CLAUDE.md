# CLAUDE.md — Project Guide & Agentic Harness

This document provides context, rules, and commands for AI agents (Claude Code, Antigravity, etc.) working on the **Math-Web / Tetris** project.

## 🛠 Build & Run Commands

- **Development Backend**: `node server.js` (Runs Express + SQLite + Socket.io)
- **Development Frontend**: `npm run dev` (Vite dev server with API proxy)
- **Production Build**: `npm run build` (Builds Vite assets to `dist/`)
- **Production Start**: `npm start` (Alias for `node server.js` - serves both API and frontend)
- **Real-time Test**: `node verify-realtime.js` (Verifies Socket.io broadcast)

## 🎨 Coding Conventions & Style

- **Frontend**: React (Functional components with Hooks).
- **Styling**: Tailwind CSS (Utility-first styling). Avoid custom CSS files when possible.
- **Icons**: Lucide React.
- **Backend**: Node.js + Express.js.
- **Real-time**: Socket.io for bi-directional event broadcasting.
- **State Management**: React `useReducer` for complex game logic.
- **Persistence**: SQLite (Local binary file: `database.sqlite`).

## 📁 Project Structure

- `src/App.jsx`: Main UI routing and Game container.
- `src/components/`: Modular UI components (TetrisGame, SineGrapher, etc.).
- `server.js`: Full-stack entry point (Express, Socket.io, SQLite).
- `dist/`: Build output (handled by Vite).
- `Dockerfile`: Multi-stage build for OCI (Alpine-based Node.js).

## 🛡 Harness Guardrails

1. **Approved Changes**: Major architectural shifts require user approval via **Implementation Plans**.
2. **Verification Protocol**: After modifying API or real-time logic, always run `node verify-realtime.js`.
3. **Persitence safety**: Do NOT commit `.sqlite` files (excluded via `.gitignore`).
4. **Mobile First**: All Tetris UI changes MUST be verified on 320px viewport simulations.

---
*Created as part of the project's Harness Engineering initiative.*

## 🤝 AI Collaboration & Handover

### Current Session State (Last updated by Antigravity)
- **Active Task**: Integrating Premium Chess Game.
- **Recent Changes**: 
    - Created `src/components/ChessGame.jsx` with themed board.
    - Added Chess tab to `App.jsx` navigation.
    - Installed `chess.js` and `react-chessboard`.
- **Handover Notes**: Claude Code should handle move validation refinement and add "Undo" functionality in `ChessGame.jsx`.

### Agent-to-Agent Memory
> [!TIP]
> **Antigravity to Claude**: I've set up the Chess visual shell. Please refine the `onDrop` logic in `ChessGame.jsx` to handle check, stalemate, and draw states more robustly. Also, implementing a move UNDO button would be a great addition.

---
**협업 인증 번호**: `AG-7788-PRO`
*(Antigravity가 Claude Code와의 공조를 확인하기 위해 남긴 비밀 번호입니다.)*
