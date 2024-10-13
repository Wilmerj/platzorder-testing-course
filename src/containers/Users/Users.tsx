import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/AuthContext";
import { getUsers, createUser, deleteUser } from "../../services/getUsers";
import classes from "./Users.module.scss";

export const Users: React.FC = () => {
  const { role } = useSession();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    // if (role !== "superadmin") {
    //   navigate("/");
    //   return;
    // }

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role, navigate]);

  const handleCreateUser = async () => {
    try {
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser]);
      setNewUser({ username: "", password: "", role: "" });
    } catch (err) {
      setError("Failed to create user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  if (loading) {
    return <div className={classes.Users__loading}>Loading users...</div>;
  }

  if (error) {
    return <div className={classes.Users__error}>{error}</div>;
  }

  return (
    <div className={classes.Users}>
      <h2 className={classes.Users__title}>Users</h2>
      <ul className={classes.Users__list}>
        {users.map((user) => (
          <li key={user.id} className={classes.Users__item}>
            <p className={`${classes.Users__itemInfo} ${classes['Users__itemInfo--username']}`}>Username: {user.username}</p>
            <p className={`${classes.Users__itemInfo} ${classes['Users__itemInfo--role']}`}>Role: {user.role}</p>
            <button 
              className={classes.Users__deleteButton}
              onClick={() => handleDeleteUser(user.id)}
            >
              Delete User
            </button>
          </li>
        ))}
      </ul>
      <div className={classes.Users__createSection}>
        <h3 className={classes.Users__createTitle}>Create New User</h3>
        <div className={classes.Users__form}>
          <input
            className={classes.Users__input}
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            className={classes.Users__input}
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <input
            className={classes.Users__input}
            type="text"
            placeholder="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
          <button 
            className={classes.Users__createButton}
            onClick={handleCreateUser}
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
};
