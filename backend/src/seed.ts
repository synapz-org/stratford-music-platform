import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.advertisement.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.article.deleteMany();
    await prisma.magazineIssue.deleteMany();
    await prisma.event.deleteMany();
    await prisma.venue.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@stratfordmusic.com',
            passwordHash: adminPasswordHash,
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    // Create venue owner
    const venuePasswordHash = await bcrypt.hash('venue123', 12);
    const venueOwner = await prisma.user.create({
        data: {
            email: 'venue@stratfordmusic.com',
            passwordHash: venuePasswordHash,
            name: 'Stratford Theatre',
            role: 'VENUE',
            phone: '519-555-0123',
            address: '123 Shakespeare St, Stratford, ON',
        },
    });

    // Create artist
    const artistPasswordHash = await bcrypt.hash('artist123', 12);
    const artist = await prisma.user.create({
        data: {
            email: 'artist@stratfordmusic.com',
            passwordHash: artistPasswordHash,
            name: 'Local Musician',
            role: 'ARTIST',
            bio: 'Local Stratford musician with 10+ years of experience',
            phone: '519-555-0456',
        },
    });

    // Create reader
    const readerPasswordHash = await bcrypt.hash('reader123', 12);
    const reader = await prisma.user.create({
        data: {
            email: 'reader@stratfordmusic.com',
            passwordHash: readerPasswordHash,
            name: 'Music Lover',
            role: 'READER',
        },
    });

    console.log('👥 Created users');

    // Create venue
    const venue = await prisma.venue.create({
        data: {
            name: 'Stratford Theatre',
            address: '123 Shakespeare St, Stratford, ON N5A 1A1',
            phone: '519-555-0123',
            website: 'https://stratfordtheatre.com',
            description: 'Historic theatre in the heart of Stratford, hosting live music and arts events.',
            capacity: 500,
            amenities: ['Parking', 'Bar', 'Accessible Seating', 'Sound System'],
            userId: venueOwner.id,
        },
    });

    console.log('🏢 Created venue');

    // Create events
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const events = await Promise.all([
        prisma.event.create({
            data: {
                title: 'Live Jazz Night',
                description: 'An evening of smooth jazz featuring local musicians. Perfect for a romantic night out.',
                startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
                endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0),
                price: 25.00,
                category: 'LIVE_MUSIC',
                status: 'PUBLISHED',
                venueId: venue.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'Classical Piano Recital',
                description: 'Beethoven and Mozart performed by renowned pianist Sarah Johnson.',
                startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 19, 30),
                endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 21, 30),
                price: 35.00,
                category: 'CLASSICAL_MUSIC',
                status: 'PUBLISHED',
                venueId: venue.id,
            },
        }),
        prisma.event.create({
            data: {
                title: 'Comedy Night',
                description: 'Stand-up comedy featuring local and touring comedians. 18+ event.',
                startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 20, 0),
                endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 22, 0),
                price: 15.00,
                category: 'STANDUP_COMEDY',
                status: 'PUBLISHED',
                venueId: venue.id,
            },
        }),
    ]);

    console.log('🎭 Created events');

    // Create magazine issue
    const magazineIssue = await prisma.magazineIssue.create({
        data: {
            title: 'Stratford Music & Arts - December 2024',
            monthYear: 'December 2024',
            status: 'PUBLISHED',
            publishedAt: new Date(),
        },
    });

    // Create articles
    await Promise.all([
        prisma.article.create({
            data: {
                title: 'The Rise of Live Music in Stratford',
                content: 'Stratford has become a hub for live music, with venues popping up throughout the city...',
                authorId: artist.id,
                issueId: magazineIssue.id,
                status: 'PUBLISHED',
                publishedAt: new Date(),
            },
        }),
        prisma.article.create({
            data: {
                title: 'Interview with Local Jazz Band',
                content: 'We sat down with the Stratford Jazz Collective to discuss their upcoming album...',
                authorId: artist.id,
                issueId: magazineIssue.id,
                status: 'PUBLISHED',
                publishedAt: new Date(),
            },
        }),
    ]);

    console.log('📰 Created magazine content');

    // Create playlist
    await prisma.playlist.create({
        data: {
            title: 'Stratford Local Artists',
            description: 'A curated playlist featuring the best local musicians from Stratford',
            tracks: [
                { title: 'Stratford Nights', artist: 'Local Band', duration: '3:45' },
                { title: 'Shakespeare\'s Song', artist: 'Folk Collective', duration: '4:20' },
                { title: 'Avon River Blues', artist: 'Blues Trio', duration: '5:15' },
            ],
            curatorId: artist.id,
        },
    });

    console.log('🎵 Created playlist');

    // Create advertisement
    await prisma.advertisement.create({
        data: {
            adType: 'BANNER',
            content: 'Book your venue for the next big event! Contact us today.',
            advertiserId: venueOwner.id,
            paymentStatus: 'COMPLETED',
        },
    });

    console.log('📢 Created advertisement');

    console.log('✅ Database seeding completed!');
    console.log('\n📋 Sample login credentials:');
    console.log('Admin: admin@stratfordmusic.com / admin123');
    console.log('Venue: venue@stratfordmusic.com / venue123');
    console.log('Artist: artist@stratfordmusic.com / artist123');
    console.log('Reader: reader@stratfordmusic.com / reader123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 