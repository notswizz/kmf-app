// Example in a React Component
const Navbar = ({ user }) => {
    return (
      <nav>
        {/* Other nav items */}
        {user && user.isAdmin && (
          <a href="/admin">Admin</a> // Adjust this based on your routing setup
        )}
      </nav>
    );
  };
  