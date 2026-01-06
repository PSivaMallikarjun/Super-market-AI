<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
Supermarket AI Platform

AI ML driven real-time CCTV analytics and intelligent management system for retail ROI

Overview

Supermarket AI is an AI-powered management platform designed to improve revenue, reduce losses, and optimize day-to-day supermarket operations using real-time video analytics and generative AI.

The platform combines CCTV-based computer vision, multimodal AI models, and business intelligence dashboards to support smarter decision-making across customer service, inventory, operations, and marketing.

Business Problem

Supermarkets face challenges such as
Poor customer experience due to long queues and lack of assistance
Stockouts and overstock leading to revenue loss and waste
Limited visibility into in-store customer behavior
Manual monitoring of security and operations
Lack of real-time, actionable business insights

Business Objectives

Enhance customer experience
Optimize inventory and demand planning
Improve operational efficiency
Reduce shrinkage and theft
Increase overall store ROI

Key Business Requirements
Customer Service

AI chat assistant to answer customer questions
Product recommendations based on availability and preferences
Support for in-store kiosks or mobile apps

Inventory Optimization

Automated stock monitoring using shelf-level vision analytics
Demand forecasting using historical sales and footfall data
Alerts for low stock, overstock, and expiry risks

Operations and Security

Real-time CCTV stream ingestion via RTSP
People detection and tracking
Footfall and dwell time measurement
Queue length and wait time detection
Shelf interaction monitoring
Suspicious activity and anomaly detection

Business Intelligence

Analytics dashboard for
Sales trends
Customer behavior insights
Operational KPIs
Store performance comparison

Marketing Automation

AI-generated promotional content for products
Personalized offers based on demand and customer behavior
Campaign performance tracking

High-Level Architecture

CCTV cameras stream video via RTSP
Edge or cloud service ingests live streams
Frames extracted at configurable FPS
Vision inference using foundation or custom models
Events aggregated into analytics pipelines
Business rules trigger alerts and actions
Dashboards integrate with POS and ERP systems

AI Model Usage
OpenAI

Image understanding from video frames
Scene summarization and event reasoning
Low-latency real-time inference using streaming APIs

Google Gemini and Vertex AI

Vertex AI Vision streams for live video analytics
Video Intelligence for object and activity tracking
Gemini multimodal reasoning for video and image insights
Scalable deployment on Google Cloud

Anthropic Claude

Vision-based reasoning on extracted frames
Behavior analysis and anomaly interpretation
Enterprise-safe explanations for audit and reporting

Measurable ROI Outcomes

Improved conversion through optimized store layouts
Reduced shrinkage via early anomaly detection
Lower staffing costs through queue prediction
Better customer experience with real-time alerts
Data-driven merchandising and layout decisions

Official Documentation References

OpenAI
https://platform.openai.com/docs/guides/images-vision

https://platform.openai.com/docs/guides/realtime

Google Cloud
https://docs.cloud.google.com/vision-ai/docs/overview

https://cloud.google.com/video-intelligence/overview/docs

https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/video-understanding

Anthropic Claude
https://platform.claude.com/docs/en/build-with-claude/vision

Academic Research

https://arxiv.org/abs/2105.06524

https://arxiv.org/abs/2312.02078

Running the AI Studio App Locally

Prerequisites
Node.js

Steps
Install dependencies
npm install

Set environment variable in .env.local
GEMINI_API_KEY=your_api_key

Run the application
npm run dev

AI Studio app link
https://ai.studio/apps/drive/1D13c7c3-Vy4ftshATXqVXLfFRHy7_MbD

Target Users

Supermarket owners
Retail operations managers
Loss prevention teams
Marketing and merchandising teams
Data and analytics teams
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1D13c7c3-Vy4ftshATXqVXLfFRHy7_MbD

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
