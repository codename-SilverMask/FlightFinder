# Deployment Guide

## Deploy to Vercel

### 1. GitHub Repository Setup

1. Push your code to a GitHub repository
2. Make sure all files are committed

### 2. Vercel Deployment

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your flight-search-app repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty (uses default)

### 3. Environment Variables

In the Vercel dashboard, add the following environment variables:

```
AMADEUS_API_KEY=Gw0LbAG8CMMxtbcJ9w96YWAKmNsTB0PQ
AMADEUS_API_SECRET=PWe1Mq16ANwy4JSb
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Domain Configuration

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## Production Considerations

### 1. API Rate Limits

- Monitor Amadeus API usage
- Implement caching if needed
- Consider upgrading to production API limits

### 2. Performance

- Images are already optimized with Next.js
- Static generation is enabled
- API routes are serverless functions

### 3. Monitoring

- Enable Vercel Analytics
- Set up error tracking
- Monitor API response times

### 4. Security

- Environment variables are secure in Vercel
- API keys are not exposed to client
- HTTPS is automatically enabled

## Troubleshooting

### Build Errors

- Check TypeScript compilation
- Verify all dependencies are installed
- Review ESLint warnings

### Runtime Errors

- Check Vercel function logs
- Verify API credentials
- Test API endpoints individually

### Performance Issues

- Monitor bundle size
- Check for large dependencies
- Optimize images and assets

## Local Development vs Production

### Local:

```bash
npm run dev
```

### Production Build Test:

```bash
npm run build
npm start
```

### Environment Variables:

- Local: Uses hardcoded values (for demo)
- Production: Uses Vercel environment variables
