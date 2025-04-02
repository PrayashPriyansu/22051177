import { useState, useEffect } from "react";
import api from "../utils/api";

interface User {
  id: string;
  name: string;
  postCount: number;
}

const TopUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersResponse = await api.get("/users");
        const userList = usersResponse.data.users;

        const userPostCounts = await Promise.all(
          Object.entries(userList).map(async ([userId, userName]) => {
            const postsResponse = await api.get(`/users/${userId}/posts`);
            return {
              id: userId,
              name: userName as string,
              postCount: postsResponse.data.posts.length,
            };
          })
        );

        const topUsers = userPostCounts
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);

        setUsers(topUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top users:", error);
        setLoading(false);
      }
    };

    fetchTopUsers();
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Top Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <span className="bg-yellow-400 text-gray-900 font-bold rounded-full px-3 py-1">
                  #{index + 1}
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {user.postCount} {user.postCount === 1 ? "post" : "posts"}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(user.postCount / users[0].postCount) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
