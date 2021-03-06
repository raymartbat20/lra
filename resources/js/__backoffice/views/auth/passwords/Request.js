import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Button, Link, withStyles } from '@material-ui/core';

import { AuthTemplate } from '../../';
import { _route } from '../../../../utils/Navigation';
import { _queryParams, _queryString } from '../../../../utils/URL';

class PasswordRequest extends Component {
    state = {
        loading: false,
        email: '',
        message: {},
    };

    /**
     * Event listener that is triggered when the password request form is submitted.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    handleRequestPasswordSubmit = async (values, { setSubmitting }) => {
        setSubmitting(false);

        try {
            this.setState({ loading: true });

            const { history } = this.props;
            const { email } = values;
            const routeSuffix = _route('backoffice.auth.passwords.reset');

            const response = await axios.post('api/auth/password/request', {
                email,
                routeSuffix,
            });

            if (response.status === 200) {
                this.setState({
                    loading: false,
                    message: {
                        type: 'success',
                        title: 'Link Sent',
                        body: (
                            <h4>
                                Check your email to reset your account.
                                <br /> Thank you.
                            </h4>
                        ),
                        action: () => history.push(`/signin?username=${email}`),
                    },
                });
            }
        } catch (error) {
            if (!error.response) {
                this.setState({
                    loading: false,
                    message: {
                        type: 'error',
                        title: 'Something went wrong',
                        body: (
                            <h4>
                                Oops? Something went wrong here.
                                <br /> Please try again.
                            </h4>
                        ),
                        action: () => window.location.reload(),
                    },
                });

                return;
            }

            const { errors } = error.response.data;
            const { setErrors } = this.props;

            setErrors(errors);

            this.setState({ loading: false });
        }
    };

    componentDidMount() {
        const { location } = this.props;

        this.setState({
            email: _queryParams(location.search).hasOwnProperty('username')
                ? _queryParams(location.search).username
                : '',
        });
    }

    render() {
        const { classes, location, setErrors, errors: formErrors } = this.props;
        const { loading, message, email } = this.state;

        return (
            <AuthTemplate
                title="Forgot Password"
                subTitle="Enter your email and we'll send a recovery link"
                loading={loading}
                message={message}
            >
                <Formik
                    initialValues={{
                        email: !email
                            ? _queryParams(location.search).username
                            : email,
                    }}
                    onSubmit={this.handleRequestPasswordSubmit}
                    validate={values => {
                        setErrors({});
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().required(
                            `The email field is required`,
                        ),
                    })}
                >
                    {({ values, handleChange, errors, isSubmitting }) => {
                        if (formErrors && Object.keys(formErrors).length > 0) {
                            errors = formErrors;
                        }

                        return (
                            <Form>
                                <Grid container direction="column">
                                    <Grid item className={classes.formGroup}>
                                        <TextField
                                            id="email"
                                            type="email"
                                            label="Email"
                                            value={values.email}
                                            onChange={handleChange}
                                            variant="outlined"
                                            fullWidth
                                            error={errors.hasOwnProperty(
                                                'email',
                                            )}
                                            helperText={
                                                errors.hasOwnProperty(
                                                    'email',
                                                ) && errors.email
                                            }
                                        />
                                    </Grid>

                                    <Grid item className={classes.formGroup}>
                                        <Link
                                            component={props => (
                                                <RouterLink
                                                    {...props}
                                                    to={{
                                                        search: _queryString({
                                                            username: email,
                                                        }),
                                                        pathname: _route(
                                                            'backoffice.auth.signin',
                                                        ),
                                                    }}
                                                />
                                            )}
                                        >
                                            Sign in instead
                                        </Link>
                                    </Grid>
                                </Grid>

                                <Grid container justify="space-between">
                                    <Grid item />

                                    <Grid item className={classes.formGroup}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={
                                                (errors &&
                                                    Object.keys(errors).length >
                                                        0) ||
                                                isSubmitting
                                            }
                                        >
                                            Send Link
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
            </AuthTemplate>
        );
    }
}

const styles = theme => ({
    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

const Styled = withStyles(styles)(PasswordRequest);
const WrappedForm = withFormik({})(Styled);

export { WrappedForm as PasswordRequest };
