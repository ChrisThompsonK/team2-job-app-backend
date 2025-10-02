/**
 * Database seeder to add sample job data
 */

import { db } from './db/index.js';
import { jobs } from './db/schema.js';

const sampleJobs = [
	{
		title: 'Senior Software Engineer',
		company: 'Tech Innovations Ltd',
		location: 'London, UK',
		description: 'Join our dynamic team to build cutting-edge software solutions. Work with modern technologies and contribute to products used by millions.',
		requirements: JSON.stringify([
			'5+ years of software development experience',
			'Proficiency in JavaScript, TypeScript, React',
			'Experience with Node.js and databases',
			'Strong problem-solving skills',
			'Excellent communication skills'
		]),
		type: 'full-time' as const,
		remote: false,
		datePosted: new Date().toISOString(),
		applicationUrl: 'https://example.com/apply/senior-dev',
		status: 'open'
	},
	{
		title: 'Frontend Developer',
		company: 'Creative Studios',
		location: 'Manchester, UK',
		description: 'We are looking for a talented frontend developer to create amazing user experiences. You will work closely with our design team to bring mockups to life.',
		requirements: JSON.stringify([
			'3+ years of frontend development experience',
			'Expert knowledge of React, HTML5, CSS3',
			'Experience with modern build tools',
			'Understanding of responsive design',
			'Portfolio of previous work'
		]),
		type: 'full-time' as const,
		remote: true,
		datePosted: new Date().toISOString(),
		applicationUrl: 'https://example.com/apply/frontend-dev',
		status: 'open'
	},
	{
		title: 'DevOps Engineer',
		company: 'CloudTech Solutions',
		location: 'Remote',
		description: 'Help us scale our infrastructure and improve deployment processes. Work with cutting-edge cloud technologies and automation tools.',
		requirements: JSON.stringify([
			'4+ years of DevOps/Infrastructure experience',
			'Expertise in AWS/Azure/GCP',
			'Experience with Docker, Kubernetes',
			'Knowledge of CI/CD pipelines',
			'Scripting skills (Python, Bash)'
		]),
		type: 'full-time' as const,
		remote: true,
		datePosted: new Date().toISOString(),
		applicationUrl: 'https://example.com/apply/devops',
		status: 'open'
	},
	{
		title: 'Product Manager',
		company: 'InnovateCorp',
		location: 'Birmingham, UK',
		description: 'Lead product development from conception to launch. Work with cross-functional teams to deliver products that delight our customers.',
		requirements: JSON.stringify([
			'3+ years of product management experience',
			'Strong analytical and strategic thinking',
			'Experience with Agile methodologies',
			'Excellent stakeholder management skills',
			'Technical background preferred'
		]),
		type: 'full-time' as const,
		remote: false,
		datePosted: new Date().toISOString(),
		applicationUrl: 'https://example.com/apply/pm',
		status: 'open'
	},
	{
		title: 'Junior Developer',
		company: 'StartupHub',
		location: 'Edinburgh, UK',
		description: 'Perfect opportunity for a junior developer to grow their skills. Join our mentorship program and work on real projects from day one.',
		requirements: JSON.stringify([
			'0-2 years of development experience',
			'Knowledge of JavaScript or Python',
			'Basic understanding of web technologies',
			'Eagerness to learn and grow',
			'Computer Science degree or equivalent'
		]),
		type: 'full-time' as const,
		remote: false,
		datePosted: new Date().toISOString(),
		applicationUrl: 'https://example.com/apply/junior',
		status: 'open'
	}
];

const seedDatabase = async () => {
	try {
		console.log('🌱 Seeding database with sample job data...');
		
		// Insert sample jobs
		await db.insert(jobs).values(sampleJobs);
		
		console.log(`✅ Successfully inserted ${sampleJobs.length} sample jobs`);
		console.log('🎉 Database seeding completed!');
		
	} catch (error) {
		console.error('❌ Error seeding database:', error);
		process.exit(1);
	}
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	await seedDatabase();
}