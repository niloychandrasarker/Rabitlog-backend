# Vercel Deployment Setup for Backend

## Environment Variables to Add in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

```
MONGO=mongodb+srv://username:password@cluster.mongodb.net/dbname
CLERK_WEBHOOK_SECRET=whsec_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLIENT_URL=https://your-frontend.vercel.app
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxx
IMAGEKIT_PUBLIC_KEY=public_xxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
```

## Important MongoDB Configuration

### 1. Whitelist Vercel IPs in MongoDB Atlas

Since Vercel uses dynamic IPs, you need to allow all IPs:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Save

⚠️ **Security Note**: For production, consider using MongoDB Atlas's Vercel integration or implement additional security measures.

### 2. Connection String Format

Make sure your MongoDB connection string includes:

- Username and password (URL encoded if they contain special characters)
- Cluster address
- Database name

Example:

```
mongodb+srv://username:password@cluster.mongodb.net/databasename?retryWrites=true&w=majority
```

## Troubleshooting MongoDB Timeout Errors

If you're getting "buffering timed out" errors:

### Solution 1: Check MongoDB Atlas Settings

```bash
# Verify your connection string includes:
# - Correct username/password
# - Correct cluster address
# - Database name
# - Network access allows 0.0.0.0/0
```

### Solution 2: Test Connection Locally

```bash
cd Backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO).then(() => console.log('Connected!')).catch(e => console.error(e));"
```

### Solution 3: Check Vercel Logs

```bash
# In Vercel Dashboard, check:
# - Function logs for connection errors
# - Environment variables are set correctly
# - No typos in variable names
```

### Solution 4: Increase Timeout (Already implemented in connectDB.js)

```javascript
serverSelectionTimeoutMS: 5000,
socketTimeoutMS: 45000,
```

## Common Issues

### Issue: "MongooseError: Operation buffering timed out"

**Cause**: Database connection not established before queries
**Solution**: Already fixed in `connectDB.js` and `index.js`

### Issue: "Authentication failed"

**Cause**: Wrong MongoDB credentials or special characters in password
**Solution**:

- URL encode special characters in password
- Or regenerate MongoDB user with simple password

### Issue: "Network timeout"

**Cause**: MongoDB network access not configured
**Solution**: Add 0.0.0.0/0 to IP whitelist

### Issue: "Cannot connect to cluster"

**Cause**: Wrong cluster URL or database name
**Solution**: Copy fresh connection string from MongoDB Atlas

## Deployment Checklist

- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] All environment variables set in Vercel
- [ ] Environment variable names match (MONGO, not MONGO_URL)
- [ ] Connection string includes database name
- [ ] Client URL points to your frontend Vercel URL
- [ ] Clerk webhook URL updated to Vercel backend URL
- [ ] Test API endpoints after deployment

## Testing After Deployment

1. **Test Health Check**

   ```bash
   curl https://your-backend.vercel.app/posts
   ```

2. **Check Logs**

   - Go to Vercel Dashboard → Deployments → Latest Deployment → Functions
   - Check logs for any connection errors

3. **Test CRUD Operations**
   - Try creating a post
   - Try fetching posts
   - Check if authentication works

## Performance Tips

1. **Connection Reuse**: The updated `connectDB.js` reuses connections across invocations
2. **Timeouts**: Reduced timeouts prevent long-hanging connections
3. **Error Handling**: Better error messages for debugging

## Need Help?

If you're still facing issues:

1. Check Vercel function logs
2. Verify MongoDB Atlas connection
3. Test connection string locally first
4. Ensure all environment variables are set correctly
5. Check that MongoDB cluster is not paused (free tier limitation)

---

**Last Updated**: November 2025
