/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from 'react';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * Mantine Components
 */

import {
    AppShell,
    Navbar,
    Header,
    Accordion,
    MantineProvider,
    Text,
    Title,
    Grid,
    Paper,
    Input,
    Checkbox,
    Button,
    Group,
    Space,
    Center,
    CloseButton,
    Skeleton,
    TextInput,
    Modal,
    Tabs,
    FileButton,
    Switch,
    Radio,
    NumberInput,
    Select,
    Loader,
    Divider,
    Container
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification, NotificationsProvider } from '@mantine/notifications';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { IconArrowLeft } from '@tabler/icons';

/**
 * React Beautiful DnD Components
 */
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */

export default function save() {
    const post_id = document.getElementsByClassName('wp-block-wisdm-central-todo-single')[0].dataset.postId;
    const [users, setUserList] = useState([]);
    const content = document.getElementsByClassName('wisdm-central-post-content')[0].innerHTML;
    const todo_data = useForm({
        initialValues: {
            checked: false,
            title: '',
            assigned_to: '',
            due_on: '',
        }
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link
        ],
        content
    });

    useEffect(() => {
        // Get all users.
        apiFetch({
            path: 'wp/v2/users',
            method: 'GET'
        }).then((data) => {
            let user_list = [];
            data.map((user) => {
                user_list.push({
                    label: user.name,
                    value: user.id
                });
            })
            setUserList(user_list);
        });

        // Get todo data.
        apiFetch({
            path: 'wp/v2/wdm-central-to-do/' + post_id,
            method: 'GET'
        }).then((data) => {
            todo_data.setValues({
                checked: ("Done" === data.acf.task_complete[0]) ? true : false,
                title: data.title.rendered,
                due_on: formatDate(data.acf.due_on),
                assigned_to: data.acf.assigned_to,
                project_id: data.acf.project_id,
                todo_list_id: data["wisdm-central-todo-category"]
            });

            // Get Project Name
            apiFetch({
                path: 'wp/v2/wdm-central-project/' + data.acf.project_id,
                method: 'GET'
            }).then((data) => {
                todo_data.setValues({
                    project_title: data.title.rendered,
                    project_link: data.link
                })
                setLoader(false);
            });

            // Get todolist Link
            apiFetch({
                path: 'wp/v2/wisdm-central-todo-category/' + data["wisdm-central-todo-category"],
                method: 'GET'
            }).then((data) => {
                todo_data.setValues({
                    todo_list_link: data.link
                })
                setLoader(false);
            });
        });

    }, []);

    const formatDate = (dateString) => {

        if ( null === dateString ) {
            return new Date();
        }
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);

        return new Date(year, month - 1, day);
    }

    const getDateString = (date) => {
        return date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate();
    }

    const [loading, setLoader] = useState(true);

    const updateTodo = () => {
        setLoader(true);
        apiFetch({
            path: 'wp/v2/wdm-central-to-do/' + post_id,
            method: 'POST',
            data: {
                title: todo_data.values.title,
                status: "publish",
                content: editor.getHTML(),
                acf: {
                    project_id: todo_data.values.project_id,
                    task_complete: todo_data.values.checked ? ["Done"] : [],
                    due_on: getDateString(todo_data.values.due_on),
                    assigned_to: todo_data.values.assigned_to,
                }
            }
        }).then((data) => {
            if (data.hasOwnProperty('id')) {
                showNotification({
                    title: 'Success !!',
                    message: 'Todo Updated Successfully',
                })
            }
            setLoader(false);

        });
    }

    return (
        <MantineProvider theme={{ colorScheme: 'light' }}>
            <NotificationsProvider>
                <AppShell
                    padding="md"
                    header={<Header height={60} p="xs">
                        <Container>
                            <Grid>
                                <Grid.Col span={2}>
                                    <a href={todo_data.values.todo_list_link}>
                                        <IconArrowLeft
                                            size={28}
                                            color={'black'}
                                        />
                                    </a>
                                </Grid.Col>
                                <Grid.Col span={8}>
                                    <Center>
                                        <Title order={2}>{todo_data.values.project_title}</Title>
                                        {true === loading && (<Loader variant="bars" size="sm" />)}
                                    </Center>
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    <Button onClick={updateTodo}>Update</Button>
                                </Grid.Col>
                            </Grid>
                        </Container>
                    </Header>}
                    styles={(theme) => ({
                        main: { backgroundColor: '#fffcf9' },
                    })}
                >
                    <Container size="sm" px="sm">
                        <Grid p={10}>
                            <Grid.Col span={2}><Checkbox size="xl" {...todo_data.getInputProps('checked', { type: 'checkbox' })} /></Grid.Col>
                            <Grid.Col span={10}>
                                <TextInput {...todo_data.getInputProps('title')} />
                            </Grid.Col>
                        </Grid>
                        <Grid p={10}>
                            <Grid.Col span={2}><Text fw="700" >Assigned To:</Text></Grid.Col>
                            <Grid.Col span={10}>
                                <Select
                                    data={users}
                                    placeholder="Select User"
                                    {...todo_data.getInputProps('assigned_to')}
                                />
                            </Grid.Col>
                        </Grid>
                        <Grid p={10}>
                            <Grid.Col span={2}><Text fw="700" >Due On:</Text></Grid.Col>
                            <Grid.Col span={10}>
                                <DatePicker {...todo_data.getInputProps('due_on')} />
                            </Grid.Col>
                        </Grid>
                        <Grid p={10}>
                            <Grid.Col span={2}><Text fw="700" >Notes:</Text></Grid.Col>
                            <Grid.Col span={10}>
                                <RichTextEditor editor={editor}>
                                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Bold />
                                            <RichTextEditor.Italic />
                                            <RichTextEditor.Strikethrough />
                                            <RichTextEditor.ClearFormatting />
                                            <RichTextEditor.Code />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.H1 />
                                            <RichTextEditor.H2 />
                                            <RichTextEditor.H3 />
                                            <RichTextEditor.H4 />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Blockquote />
                                            <RichTextEditor.Hr />
                                            <RichTextEditor.BulletList />
                                            <RichTextEditor.OrderedList />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Link />
                                            <RichTextEditor.Unlink />
                                        </RichTextEditor.ControlsGroup>
                                    </RichTextEditor.Toolbar>

                                    <RichTextEditor.Content />
                                </RichTextEditor>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider>
    );
}

document.addEventListener("DOMContentLoaded", function (event) {

    let elem = document.getElementsByClassName('wisdm-central-container-todo');
    if (elem.length > 0) {
        ReactDOM.render(React.createElement(save), elem[0]);
    }
    document.getElementById('wpadminbar').style.display = 'none';

});