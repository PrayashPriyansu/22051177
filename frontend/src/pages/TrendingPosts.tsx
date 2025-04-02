import { useState, useEffect } from "react";
import axios from "axios";

interface Post {
  id: number;
  userid: number;
  content: string;
  commentCount: number;
}

interface User {
  [key: string]: string;
}

const TrendingPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const usersResponse = await axios.get(
          "http://20.244.56.144/evaluation-service/users"
        );
        setUsers(usersResponse.data.users);

        const userPostsPromises = Object.keys(usersResponse.data.users).map(
          (userId) =>
            axios.get(
              `http://20.244.56.144/evaluation-service/users/${userId}/posts`
            )
        );

        const postsResponses = await Promise.all(userPostsPromises);
        const allPosts = postsResponses.flatMap(
          (response) => response.data.posts
        );

        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            try {
              const commentsResponse = await axios.get(
                `http://20.244.56.144/evaluation-service/posts/${post.id}/comments`
              );
              return {
                ...post,
                commentCount: commentsResponse.data.comments.length,
              };
            } catch (error) {
              return {
                ...post,
                commentCount: 0,
              };
            }
          })
        );

        const maxComments = Math.max(
          ...postsWithComments.map((p) => p.commentCount)
        );

        const trendingPosts = postsWithComments.filter(
          (post) => post.commentCount === maxComments
        );

        setPosts(trendingPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Trending Posts</h1>
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <p className="font-semibold text-lg">
                {users[post.userid] || `User ${post.userid}`}
              </p>
            </div>
            <p className="text-gray-800 mb-4">{post.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {post.commentCount}{" "}
                {post.commentCount === 1 ? "comment" : "comments"}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                Trending
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
