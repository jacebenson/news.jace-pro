import { Link, NavLink, routes } from '@redwoodjs/router'
import { styles } from 'src/lib/styles'
import { icons } from 'src/lib/icons'
const NavSidebar = ({ children, isAuthenticated, currentUser, hasRole }) => {
  //const { isAuthenticated, hasRole, currentUser } = useAuth()
  let toggleMenu = () => {
    document.querySelector('#navSideBar').classList.toggle(['hidden'])
  }
  return (
    <>
      <div className="flex flex-wrap bg-gray-100 w-full h-screen">
        <div id="navSideBar" className="hidden xl:block xl:h-screen w-6/6">
          {isAuthenticated && (
            <div className="w-full h-full bg-white rounded p-3 shadow-lg">
              <div className="flex items-center space-x-4 p-2 mb-5">
                {icons.profile}

                <div>
                  <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">
                    <Link to={routes.user({ id: currentUser.id })}>
                      {currentUser.name}
                    </Link>
                  </h4>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                {/**Dashboard */}
                <li>
                  <NavLink
                    to={routes.about()}
                    activeClassName={styles.active}
                    className={styles.notActive}
                    onClick={toggleMenu}
                  >
                    <span className="text-gray-600">{icons.dashboard}</span>
                    <span>
                      {currentUser.messages['Dashboard'] || 'Dashboard'}
                    </span>
                  </NavLink>
                </li>
                {/**Profile */}
                <li>
                  <NavLink
                    to={routes.user({ id: currentUser.id })}
                    activeClassName={styles.active}
                    className={styles.notActive}
                    onClick={toggleMenu}
                  >
                    <span className="text-gray-600">{icons.profile}</span>
                    <span>
                      {currentUser.messages['My profile'] || 'My profile'}
                    </span>
                  </NavLink>
                </li>
                {/**Users */}
                {hasRole(['userRead', 'admin']) && (
                  <li>
                    <NavLink
                      to={routes.users()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className="text-gray-600">{icons.users}</span>
                      <span>{currentUser.messages['Users'] || 'Users'}</span>
                    </NavLink>
                  </li>
                )}
                {/**Groups */}
                {hasRole(['groupRead', 'admin']) && (
                  <li>
                    <NavLink
                      to={routes.groups()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className=" text-gray-600">{icons.groups}</span>
                      <span>{currentUser.messages['Groups'] || 'Groups'}</span>
                    </NavLink>
                  </li>
                )}
                {/**Group members */}
                {hasRole(['groupMemberRead', 'admin']) && (
                  <li>
                    <NavLink
                      to={routes.groupMembers()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className=" text-gray-600">{icons.list}</span>
                      <span>
                        {currentUser.messages['Group Members'] ||
                          'Group Members'}
                      </span>
                    </NavLink>
                  </li>
                )}
                {/**Group roles */}
                {hasRole(['groupRoleRead', 'admin']) && (
                  <li>
                    <NavLink
                      to={routes.groupRoles()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className=" text-gray-600">{icons.list}</span>
                      <span>
                        {currentUser.messages['Group Roles'] || 'Group Roles'}
                      </span>
                    </NavLink>
                  </li>
                )}

                {/**All Preferences */}
                {hasRole(['admin']) && (
                  <li>
                    <NavLink
                      to={routes.preferences()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className=" text-gray-600">{icons.list}</span>
                      <span>
                        {currentUser.messages['Preferences'] || 'Preferences'}
                      </span>
                    </NavLink>
                  </li>
                )}
                {/**Sources */}

                {hasRole(['sourceRead', 'admin']) && (
                  <li>
                    <NavLink
                      to={routes.sources()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className=" text-gray-600">{icons.list}</span>
                      <span>
                        {currentUser.messages['Sources'] || 'Sources'}
                      </span>
                    </NavLink>
                  </li>
                )}
                {/**Articles */}

                {hasRole(['articleRead', 'admin']) && (
                  <li>
                    <NavLink
                      to={routes.articles()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className=" text-gray-600">{icons.list}</span>
                      <span>
                        {currentUser.messages['Articles'] || 'Articles'}
                      </span>
                    </NavLink>
                  </li>
                )}
                {/**Properties */}

                {hasRole(['admin']) && (
                  <li>
                    <NavLink
                      to={routes.properties()}
                      activeClassName={styles.active}
                      className={styles.notActive}
                      onClick={toggleMenu}
                    >
                      <span className=" text-gray-600">{icons.list}</span>
                      <span>
                        {currentUser.messages['Properties'] || 'Properties'}
                      </span>
                    </NavLink>
                  </li>
                )}
                <li>
                  <Link
                    className={styles.notActive}
                    to={routes.logout()}
                    onClick={toggleMenu}
                  >
                    <span className="text-gray-600">{icons.logout}</span>
                    <span>{currentUser.messages['Logout'] || 'Logout'}</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {!isAuthenticated && (
            <div className="w-full h-full bg-white rounded p-3 shadow-lg">
              <ul className="space-y-2 text-sm">
                <li>
                  <NavLink
                    to={routes.about()}
                    activeClassName={styles.active}
                    className={styles.notActive}
                    onClick={toggleMenu}
                  >
                    <span className="text-gray-600">{icons.info}</span>
                    <span>About</span>
                  </NavLink>
                </li>

                <li>
                  <Link
                    to={routes.signup()}
                    className={styles.notActive}
                    onClick={toggleMenu}
                  >
                    <span className="text-gray-600">{icons.signup}</span>
                    <span>Sign up</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.notActive}
                    to={routes.login()}
                    onClick={toggleMenu}
                  >
                    <span className="text-gray-600">{icons.login}</span>
                    <span>Login</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="xl:w-9/12 w-full">
          <div className="p-4 text-gray-500">{children}</div>
        </div>
      </div>
    </>
  )
}

export default NavSidebar
