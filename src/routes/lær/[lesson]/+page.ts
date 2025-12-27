import { lessons } from '$lib/data/lessons';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const lesson = lessons[params.lesson];
	
	if (!lesson) {
		throw error(404, 'Lesson not found');
	}
	
	return {
		lesson
	};
}
