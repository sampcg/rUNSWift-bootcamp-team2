class Role:
    """
    Abstract class for a role. Used by Positioning and should
    be in charge of calculating the optimal position, and heading
    of the robot, assuming it is in this role. It should consider
    the current position of the robot, position of the ball,
    and what other robots are doing
    """

    # Desired position of role (Vector2D(mm, mm))
    position = None

    # Desired heading of role (rad)
    heading = None

    # Desired position_error of role (mm)
    position_error = None

    # Desired heading_error of role (rad)
    heading_error = None

    # A function called from the Positioning class, which should
    # update member variables:
    # - position
    # - heading
    # - position_error
    # - heading_error
    def evaluate(self):
        pass

    # Have reference to the positioning, so role can access
    # functions from the positioning class
    positioning = None

    def __init__(self, positioning):
        self.positioning = positioning
