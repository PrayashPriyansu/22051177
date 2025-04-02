import { useState, useEffect } from "react";
import axios from "axios";

interface Post {
  id: number;
  userid: number;
  content: string;
}

interface User {
  [key: string]: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "http://20.244.56.144/evaluation-service/users"
        );
        setUsers(usersResponse.data.users);

        const postsPromises = Object.keys(usersResponse.data.users).map(
          (userId) =>
            axios.get(
              `http://20.244.56.144/evaluation-service/users/${userId}/posts`
            )
        );

        const postsResponses = await Promise.all(postsPromises);
        const allPosts = postsResponses.flatMap(
          (response) => response.data.posts
        );

        setPosts(allPosts.sort((a, b) => b.id - a.id));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Latest Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <p className="font-semibold text-lg">
              {users[post.userid] || `User ${post.userid}`}
            </p>
          </div>
          <p className="text-gray-800 mb-4">{post.content}</p>
          <div className="flex items-center text-gray-500">
            <a
              href={`http://20.244.56.144/evaluation-service/posts/${post.id}/comments`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Comments
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
