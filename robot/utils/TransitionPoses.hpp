#ifndef TRANSITION_POSES_HPP
#define TRANSITION_POSES_HPP

#include "SPLDefs.hpp"

#include <boost/math/constants/constants.hpp>

/*
 * X, Y, THETA of robots upon transitioning game states
 */

// Initial State Poses (Px = Player Number x)

#define INITIAL_POSE_P1_X -3900 // Inline with Goal Box
#define INITIAL_POSE_P1_Y 3000
#define INITIAL_POSE_P1_THETA -boost::math::float_constants::half_pi

#define INITIAL_POSE_P2_X -3240
#define INITIAL_POSE_P2_Y -3000
#define INITIAL_POSE_P2_THETA boost::math::float_constants::half_pi

#define INITIAL_POSE_P3_X -2810 // Inline with Penalty box
#define INITIAL_POSE_P3_Y 3000
#define INITIAL_POSE_P3_THETA -boost::math::float_constants::half_pi

#define INITIAL_POSE_P4_X -2160
#define INITIAL_POSE_P4_Y -3000
#define INITIAL_POSE_P4_THETA boost::math::float_constants::half_pi

#define INITIAL_POSE_P5_X -1700
#define INITIAL_POSE_P5_Y 3000
#define INITIAL_POSE_P5_THETA -boost::math::float_constants::half_pi

#define INITIAL_POSE_P6_X -1200
#define INITIAL_POSE_P6_Y -3000
#define INITIAL_POSE_P6_THETA boost::math::float_constants::half_pi

#define INITIAL_POSE_P7_X -700
#define INITIAL_POSE_P7_Y 3000
#define INITIAL_POSE_P7_THETA -boost::math::float_constants::half_pi

#define INITIAL_POSE_DEFAULT_X -4000
#define INITIAL_POSE_DEFAULT_Y -3000
#define INITIAL_POSE_DEFAULT_THETA boost::math::float_constants::half_pi

// Unpenalised Hypotheses (H1 = Hypothesis 1)

#define UNPENALISED_H1_X -PENALTY_CROSS_ABS_X
#define UNPENALISED_H1_Y FIELD_WIDTH / 2.0 + 500
#define UNPENALISED_H1_THETA -M_PI / 2.0

#define UNPENALISED_H2_X -PENALTY_CROSS_ABS_X
#define UNPENALISED_H2_Y -FIELD_WIDTH / 2.0 - 500
#define UNPENALISED_H2_THETA M_PI / 2.0

#define UNPENALISED_H3_X -FIELD_LENGTH / 6.0
#define UNPENALISED_H3_Y -FIELD_WIDTH / 2.0 - 500
#define UNPENALISED_H3_THETA M_PI / 2.0

#define UNPENALISED_H4_X -FIELD_LENGTH / 6.0
#define UNPENALISED_H4_Y FIELD_WIDTH / 2.0 + 500
#define UNPENALISED_H4_THETA -M_PI / 2.0

// Penalty Shoot Poses

#define PENALTY_SHOOT_OFFENSE_POSE_X 2200
#define PENALTY_SHOOT_OFFENSE_POSE_Y 0
#define PENALTY_SHOOT_OFFENSE_POSE_THETA 0

#define PENALTY_SHOOT_DEFENSE_POSE_X -FIELD_LENGTH / 2
#define PENALTY_SHOOT_DEFENSE_POSE_Y 0
#define PENALTY_SHOOT_DEFENSE_POSE_THETA 0

#define PENALTY_SHOOT_SELECTED_POSE_X -4000
#define PENALTY_SHOOT_SELECTED_POSE_Y -2000
#define PENALTY_SHOOT_SELECTED_POSE_THETA boost::math::float_constants::half_pi

#endif // TRANSITION_POSES_HPP
